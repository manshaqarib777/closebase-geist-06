import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: string;
  title: string;
  company_name: string;
  logo?: string;
  screening_questions?: string[];
  status?: string;
  already_applied?: boolean;
  application_thread_id?: string;
}

interface ApplyButtonProps {
  job: Job;
  onApply: (job: Job) => void;
}

// Mock profile state - in real app would come from context/store
const mockProfile = {
  cv_path: true, // has CV
  avg_deal_size: 15000, // has average deal size
  assessment_completed: false
};

export function ApplyButton({ job, onApply }: ApplyButtonProps) {
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  const profileIncomplete = !mockProfile.cv_path || !mockProfile.avg_deal_size;
  const hasScreeningQuestions = (job.screening_questions?.length ?? 0) > 0;
  const isJobClosed = job.status === 'closed' || job.status === 'expired';
  
  const getTooltipMessage = () => {
    if (isJobClosed) return "Job ist nicht mehr verfügbar";
    if (!mockProfile.cv_path) return "Bitte laden Sie zuerst Ihren Lebenslauf hoch";
    if (!mockProfile.avg_deal_size) return "Bitte vervollständigen Sie Ihr Profil (Durchschnittliche Dealgröße)";
    return hasScreeningQuestions ? "Anfrage ausfüllen" : "Sofort anfragen";
  };

  const handleQuickApply = async () => {
    if (profileIncomplete || isJobClosed) return;
    
    setIsApplying(true);
    
    try {
      // Create application
      const { data: application, error } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          stage: 'applied',
          fit_score: Math.floor(Math.random() * 40) + 60, // Mock fit score
          answers: null,
          cv_path: 'mock-cv-path.pdf',
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
        await supabase
          .from('messages')
          .insert({
            thread_id: thread.id,
            sender_id: (await supabase.auth.getUser()).data.user?.id,
            body: `Hallo ${job.company_name},

ich interessiere mich für die Position **${job.title}**.

**Mein Profil:**
• Rolle: Closer • Seniorität: Senior
• Ø Dealgröße: €${mockProfile.avg_deal_size.toLocaleString('de-DE')} • Sales-Zyklus: 1-2 Monate
• Sprachen: Deutsch, Englisch
• SCI-Score: ${mockProfile.assessment_completed ? '85' : '—'}

Mein vollständiges Profil: [Profil ansehen](/profile)

Ich freue mich auf Ihre Rückmeldung!`,
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

    } catch (error) {
      console.error('Apply error:', error);
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Es gab ein Problem beim Senden Ihrer Anfrage. Bitte versuchen Sie es erneut."
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleModalApply = () => {
    if (profileIncomplete || isJobClosed) return;
    onApply(job);
  };

  // If already applied, show chat button
  if (job.already_applied) {
    return (
      <Button variant="ghost" asChild>
        <a href={`/threads/${job.application_thread_id}`}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Zum Chat
        </a>
      </Button>
    );
  }

  const button = hasScreeningQuestions ? (
    <Button 
      onClick={handleModalApply}
      disabled={profileIncomplete || isJobClosed || isApplying}
      className={profileIncomplete || isJobClosed ? "opacity-60" : ""}
    >
      {isApplying ? "Wird gesendet..." : "Anfragen"}
    </Button>
  ) : (
    <Button 
      onClick={handleQuickApply}
      disabled={profileIncomplete || isJobClosed || isApplying}
      className={profileIncomplete || isJobClosed ? "opacity-60" : ""}
    >
      {isApplying ? "Wird gesendet..." : "Anfragen"}
    </Button>
  );

  if (profileIncomplete || isJobClosed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p>{getTooltipMessage()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}