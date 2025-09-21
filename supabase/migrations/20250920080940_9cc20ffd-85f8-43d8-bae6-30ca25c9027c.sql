-- Create notifications table for in-app notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'application_new', 'admin_application_new', 'interview_proposed', etc.
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- System can create notifications
CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Create index for performance
CREATE INDEX idx_notifications_user_id_created_at ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_user_id_read ON public.notifications(user_id, read);

-- Create trigger for updated_at
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add environment variables to store admin emails
INSERT INTO public.notifications (user_id, type, title, message, data, read) 
SELECT 
  (SELECT id FROM auth.users LIMIT 1), 
  'system_message', 
  'Notification System Setup', 
  'Der Notification-System ist eingerichtet. Bitte konfigurieren Sie CLOSEBASE_ADMIN_EMAILS in den Environment Variables.',
  '{"setup": true}',
  false
WHERE EXISTS (SELECT 1 FROM auth.users LIMIT 1);