import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Calendar, Clock, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const interviews = [
  {
    id: 1,
    company: "TechCorp GmbH",
    position: "Senior Sales Manager",
    date: "2024-01-15",
    time: "14:00",
    stage: "Final Round",
    logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=40&h=40&fit=crop&crop=entropy"
  },
  {
    id: 2,
    company: "StartupX",
    position: "Account Executive", 
    date: "2024-01-17",
    time: "10:30",
    stage: "First Interview",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=entropy"
  },
  {
    id: 3,
    company: "GrowthCo",
    position: "Regional Manager",
    date: "2024-01-19", 
    time: "16:00",
    stage: "Team Meeting",
    logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=40&h=40&fit=crop&crop=entropy"
  }
];

export function InterviewsSection() {
  const navigate = useNavigate();

  const handleOpenCalendar = () => {
    navigate('/calendar');
  };

  const handleOpenInterviewLink = (interviewId: number) => {
    // This would typically open the interview link or meeting room
    window.open('#', '_blank');
  };

  return (
    <GlassCard variant="surface" className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Anstehende Interviews
        </h2>
        <Button 
          variant="ghost" 
          className="text-cb-primary font-ui font-medium"
          onClick={handleOpenCalendar}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Kalender öffnen
        </Button>
      </div>
      
      <div className="space-y-4">
        {interviews.map((interview) => (
          <div 
            key={interview.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-cb-surface/50 transition-smooth"
          >
            <div className="flex items-center gap-4">
              <img 
                src={interview.logo}
                alt={interview.company}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-ui font-medium text-foreground">{interview.position}</h3>
                <p className="text-sm text-muted-foreground">{interview.company}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <StatusBadge variant="applied">
                {interview.stage}
              </StatusBadge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-ui">
                <Calendar className="w-4 h-4" />
                {new Date(interview.date).toLocaleDateString('de-DE')}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-ui">
                <Clock className="w-4 h-4" />
                {interview.time}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-cb-primary"
                onClick={() => handleOpenInterviewLink(interview.id)}
                title="Interview-Link öffnen"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}