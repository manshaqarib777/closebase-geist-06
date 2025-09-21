import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Video, Trash2, Play, Pause } from 'lucide-react';

interface VideoIntroductionProps {
  profile: {
    intro_video_path?: string;
    intro_video_thumb_path?: string;
    intro_video_duration?: number;
    intro_video_visibility?: string;
    intro_video_uploaded_at?: string;
  };
  onUpdate: () => void;
}

export function VideoIntroduction({ profile, onUpdate }: VideoIntroductionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [visibility, setVisibility] = useState(profile.intro_video_visibility || 'on_apply');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const visibilityOptions = [
    { value: 'on_apply', label: 'Nur bei Bewerbung' },
    { value: 'verified_only', label: 'Nur verifizierte Unternehmen' },
    { value: 'public', label: 'Öffentlich (nicht gelistet)' },
    { value: 'private', label: 'Privat (nur ich)' }
  ];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const uploadVideo = async (file: File | Blob, fileName: string) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = fileName.split('.').pop();
      const filePath = `${user.id}/intro_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
      }, 1000);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          intro_video_path: filePath,
          intro_video_visibility: visibility,
          intro_video_uploaded_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast.success('Video hochgeladen');
      onUpdate();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Fehler beim Hochladen');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 200 * 1024 * 1024) {
      toast.error('Datei zu groß (max. 200MB)');
      return;
    }

    await uploadVideo(file, file.name);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: true 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = URL.createObjectURL(blob);
          videoRef.current.controls = true;
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);

      // Auto-stop after 90 seconds
      setTimeout(() => {
        if (isRecording) stopRecording();
      }, 90000);

    } catch (error) {
      toast.error('Kamera/Mikrofon nicht verfügbar');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const uploadRecording = async () => {
    if (recordedBlob) {
      await uploadVideo(recordedBlob, 'intro.webm');
      setRecordedBlob(null);
    }
  };

  const updateVisibility = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ intro_video_visibility: visibility })
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast.success('Sichtbarkeit aktualisiert');
      onUpdate();
    } catch (error) {
      toast.error('Fehler beim Aktualisieren');
    }
  };

  const deleteVideo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (profile.intro_video_path) {
        await supabase.storage
          .from('videos')
          .remove([profile.intro_video_path]);
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          intro_video_path: null,
          intro_video_thumb_path: null,
          intro_video_duration: null,
          intro_video_uploaded_at: null
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Video entfernt');
      onUpdate();
    } catch (error) {
      toast.error('Fehler beim Löschen');
    }
  };

  return (
    <section className="cb-card p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="cb-title">Video-Vorstellung</h2>
          <p className="cb-sub">
            30–90 Sekunden, max. 200 MB. Formate: mp4, mov, webm. Sichtbar je nach Einstellung.
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <Select value={visibility} onValueChange={setVisibility}>
            <SelectTrigger className="cb-select w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {visibilityOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={updateVisibility} className="cb-btn-ghost">
            Speichern
          </Button>
        </div>
      </div>

        {profile.intro_video_path ? (
          <>
            <div className="grid md:grid-cols-[1fr_260px] gap-4">
              <div className="aspect-video rounded-xl overflow-hidden border bg-black/5" style={{ borderColor: 'hsl(var(--cb-border))' }}>
                <video 
                  controls 
                  playsInline 
                  className="w-full h-full"
                  preload="metadata"
                  src={`https://xpftqiboqtumlketjhmw.supabase.co/storage/v1/object/public/videos/${profile.intro_video_path}`}
                />
              </div>

              <div className="space-y-3">
                <div className="cb-sub">
                  <div>
                    Hochgeladen: {profile.intro_video_uploaded_at 
                      ? new Date(profile.intro_video_uploaded_at).toLocaleDateString('de-DE')
                      : '—'}
                  </div>
                  <div>
                    Dauer: {profile.intro_video_duration 
                      ? formatDuration(profile.intro_video_duration) 
                      : '—'}
                  </div>
                </div>

                <Button 
                  onClick={deleteVideo} 
                  className="cb-btn bg-[#FEECEC] text-[#B91C1C] hover:bg-[#FBD7D7] w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Video entfernen
                </Button>

                <div className="cb-help">
                  Mit dem Hochladen bestätigst du, die Rechte am Video zu besitzen und die{' '}
                  <a href="/agb" className="text-primary hover:underline">
                    Nutzungsbedingungen
                  </a>{' '}
                  zu akzeptieren.
                </div>
              </div>
            </div>

            <hr className="my-4" style={{ borderColor: 'hsl(var(--cb-border))' }} />

            {/* Replace Video */}
            <div className="grid md:grid-cols-[1fr_auto] gap-3 items-end">
              <div className="cb-dropzone p-4 text-center">
                <div>
                  <label className="cb-label">Neues Video hochladen</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleFileUpload}
                    className="cb-input mt-2"
                  />
                  <p className="cb-help mt-2">Empfohlen: 30–90s, 720p, ≤200 MB</p>
                </div>
                {isUploading && (
                  <div className="mt-3">
                    <div className="cb-progress">
                      <div style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <div className="cb-help mt-1">
                      {Math.round(uploadProgress)}%
                    </div>
                  </div>
                )}
              </div>
              <Button className="cb-btn-primary">Hochladen</Button>
            </div>
          </>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Upload */}
            <div className="cb-card p-4">
              <label className="cb-label">Video hochladen</label>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleFileUpload}
                className="cb-input mt-2"
              />
              <p className="cb-help mt-2">
                Empfohlen: 30–90s, 720p, ≤200 MB
              </p>
              {isUploading && (
                <div className="mt-3">
                  <div className="cb-progress">
                    <div style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <div className="cb-help mt-1">
                    {Math.round(uploadProgress)}%
                  </div>
                </div>
              )}
              <Button className="cb-btn-primary mt-3">Hochladen</Button>
            </div>

            {/* Record */}
            <div className="cb-card p-4">
              <label className="cb-label">Oder direkt aufnehmen</label>
              <div className="mt-2 aspect-video rounded-xl overflow-hidden border bg-black/5" style={{ borderColor: 'hsl(var(--cb-border))' }}>
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  playsInline
                  muted={!recordedBlob}
                />
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={startRecording}
                  disabled={isRecording}
                  className="cb-btn-ghost"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Aufnahme starten
                </Button>
                <Button
                  onClick={stopRecording}
                  disabled={!isRecording}
                  className="cb-btn-ghost"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Stop
                </Button>
                <Button
                  onClick={uploadRecording}
                  disabled={!recordedBlob}
                  className="cb-btn-primary"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Hochladen
                </Button>
              </div>
              <p className="cb-help mt-2">
                Max. 90s. Kamera-Zugriff im Browser erlauben.
              </p>
            </div>
          </div>
        )}
    </section>
  );
}
