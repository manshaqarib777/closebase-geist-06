import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Upload, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: string;
  title: string;
  company_name: string;
  logo?: string;
  screening_questions?: string[];
}

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock user CVs - in real app would come from database
const mockUserCvs = [
  { path: 'cv-current.pdf', name: 'Aktueller Lebenslauf (CV_2024.pdf)' },
  { path: 'cv-old.pdf', name: 'Älterer Lebenslauf (CV_2023.pdf)' }
];

export function ApplyModal({ job, isOpen, onClose }: ApplyModalProps) {
  const [cvChoice, setCvChoice] = useState(mockUserCvs[0]?.path || '');
  const [cvUpload, setCvUpload] = useState<File | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [shareVideo, setShareVideo] = useState(false);
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCvUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Ungültiger Dateityp",
          description: "Nur PDF/DOCX Dateien sind erlaubt."
        });
        return;
      }

      if (file.size > maxSize) {
        toast({
          variant: "destructive", 
          title: "Datei zu groß",
          description: "Datei muss kleiner als 10 MB sein."
        });
        return;
      }

      setCvUpload(file);
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!job) return;

    // Validation for screening questions
    const requiredAnswers = job.screening_questions?.length || 0;
    if (requiredAnswers > 0 && answers.some((answer, index) => index < requiredAnswers && !answer.trim())) {
      toast({
        variant: "destructive",
        title: "Pflichtfragen nicht beantwortet",
        description: "Bitte beantworten Sie alle Screening-Fragen."
      });
      return;
    }

    if (!consent) {
      toast({
        variant: "destructive",
        title: "Einverständnis erforderlich",
        description: "Bitte stimmen Sie den Bedingungen zu."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine CV path
      let finalCvPath = cvChoice;
      if (cvChoice === '__upload' && cvUpload) {
        // In real app, would upload file to storage
        finalCvPath = `cvs/uploaded-${Date.now()}.pdf`;
      }

      // Create application
      const { data: application, error } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          stage: 'applied',
          fit_score: Math.floor(Math.random() * 40) + 60, // Mock fit score
          answers: answers.slice(0, requiredAnswers),
          cv_path: finalCvPath,
          source: 'closebase'
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            variant: "destructive",
            title: "Bereits beworben",
            description: "Sie haben sich bereits für diese Position beworben."
          });
          return;
        }
        throw error;
      }

      // Create thread and initial message
      const { data: thread } = await supabase
        .from('threads')
        .insert({
          topic_type: 'application',
          topic_id: application.id
        })
        .select()
        .single();

      if (thread) {
        // Create structured intro message
        let messageBody = `Hallo ${job.company_name},

ich interessiere mich für die Position **${job.title}**.

**Mein Profil:**
• Rolle: Closer • Seniorität: Senior
• Ø Dealgröße: €15.000 • Sales-Zyklus: 1-2 Monate
• Sprachen: Deutsch, Englisch
• SCI-Score: —`;

        // Add screening answers if provided
        if (job.screening_questions && answers.length > 0) {
          messageBody += '\n\n**Antworten auf Ihre Fragen:**';
          job.screening_questions.forEach((question, index) => {
            if (answers[index]) {
              messageBody += `\n\n**${question}**\n${answers[index]}`;
            }
          });
        }

        // Add note if provided
        if (note.trim()) {
          messageBody += `\n\n**Kurz-Notiz:**\n${note}`;
        }

        messageBody += '\n\nMein vollständiges Profil: [Profil ansehen](/profile)';

        await supabase
          .from('messages')
          .insert({
            thread_id: thread.id,
            sender_id: (await supabase.auth.getUser()).data.user?.id,
            body: messageBody,
          });
      }

      // Send notifications via edge function
      try {
        await supabase.functions.invoke('send-application-notifications', {
          body: {
            application_id: application.id,
            type: 'recruiter'
          }
        });

        await supabase.functions.invoke('send-application-notifications', {
          body: {
            application_id: application.id,
            type: 'admin'
          }
        });
      } catch (notificationError) {
        console.error('Error sending notifications:', notificationError);
        // Don't fail the application if notifications fail
      }

      toast({
        title: "Anfrage gesendet!",
        description: `Ihre Anfrage für ${job.title} wurde erfolgreich übermittelt.`
      });
      
      handleClose();
      
      // Redirect to thread
      if (thread) {
        window.location.href = `/threads/${thread.id}`;
      }

    } catch (error) {
      console.error('Apply error:', error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Es gab ein Problem beim Senden Ihrer Anfrage. Bitte versuchen Sie es erneut."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCvChoice(mockUserCvs[0]?.path || '');
    setCvUpload(null);
    setAnswers([]);
    setNote("");
    setShareVideo(false);
    setConsent(false);
    onClose();
  };

  const requiredAnswers = job?.screening_questions?.length || 0;
  const answersComplete = requiredAnswers === 0 || answers.every((answer, index) => 
    index >= requiredAnswers || answer.trim()
  );
  const isValid = answersComplete && consent;

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={job.logo} />
              <AvatarFallback>{job.company_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle>Bewerbung senden</DialogTitle>
              <DialogDescription>
                {job.title} bei {job.company_name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4 overflow-y-auto">
          {/* CV Selection */}
          <div className="space-y-2">
            <Label>Lebenslauf</Label>
            <div className="flex gap-2">
              <Select value={cvChoice} onValueChange={setCvChoice}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockUserCvs.map((cv) => (
                    <SelectItem key={cv.path} value={cv.path}>
                      {cv.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="__upload">Neue Datei hochladen…</SelectItem>
                </SelectContent>
              </Select>
              {cvChoice === '__upload' && (
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvUploadChange}
                  className="hidden"
                  id="cv-upload"
                />
              )}
            </div>
            {cvChoice === '__upload' && (
              <Label htmlFor="cv-upload" className="cursor-pointer text-sm text-primary hover:underline">
                Datei auswählen (PDF/DOC bis 10 MB)
              </Label>
            )}
            {cvUpload && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <FileText className="h-4 w-4" />
                <span className="text-sm flex-1 truncate">{cvUpload.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCvUpload(null)}
                  className="h-auto p-1"
                >
                  ×
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">PDF/DOC bis 10 MB.</p>
          </div>

          {/* Screening Questions */}
          {job?.screening_questions?.map((question, index) => (
            <div key={index} className="space-y-2">
              <Label>
                {question} <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="min-h-20 resize-none"
                required
              />
            </div>
          ))}

          {/* Optional Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Kurze Notiz (optional)</Label>
            <Textarea
              id="note"
              placeholder="200–600 Zeichen – z. B. warum Sie gut passen."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-20 resize-none"
              maxLength={600}
            />
            <div className="text-xs text-muted-foreground text-right">
              {note.length}/600
            </div>
          </div>

          {/* Video Sharing */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="share-video"
              checked={shareVideo}
              onCheckedChange={(checked) => setShareVideo(checked === true)}
            />
            <Label htmlFor="share-video" className="text-sm">
              Video-Vorstellung beilegen (falls vorhanden)
            </Label>
          </div>

          {/* Consent */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked === true)}
            />
            <Label htmlFor="consent" className="text-sm leading-5">
              Ich stimme zu, dass meine Daten zur Bearbeitung der Bewerbung verwendet werden.{" "}
              <span className="text-destructive">*</span>
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Wird gesendet..." : "Anfrage senden"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}