-- Add video introduction fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN intro_video_path TEXT,
ADD COLUMN intro_video_thumb_path TEXT,
ADD COLUMN intro_video_duration INTEGER, -- seconds
ADD COLUMN intro_video_visibility TEXT DEFAULT 'on_apply' CHECK (intro_video_visibility IN ('on_apply', 'verified_only', 'public', 'private')),
ADD COLUMN intro_video_uploaded_at TIMESTAMP WITH TIME ZONE;

-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', false);

-- Create storage policies for video uploads
CREATE POLICY "Users can upload their own videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view videos based on visibility settings" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'videos' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR -- Own videos
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id::text = (storage.foldername(name))[1] 
      AND intro_video_visibility IN ('public', 'on_apply', 'verified_only')
    )
  )
);