import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const applications = [
  {
    id: 1,
    title: "Senior Sales Manager",
    company: "TechCorp GmbH",
    status: "interview" as const,
    appliedDays: 3,
    logo: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=40&h=40&fit=crop&crop=entropy"
  },
  {
    id: 2,
    title: "Account Executive",
    company: "StartupX",
    status: "shortlist" as const,
    appliedDays: 5,
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=entropy"
  },
  {
    id: 3,
    title: "Business Development",
    company: "Scale Solutions",
    status: "applied" as const,
    appliedDays: 7,
    logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=40&h=40&fit=crop&crop=entropy"
  },
  {
    id: 4,
    title: "Sales Director",
    company: "Enterprise Inc",
    status: "hired" as const,
    appliedDays: 14,
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=40&h=40&fit=crop&crop=entropy"
  },
  {
    id: 5,
    title: "Regional Manager",
    company: "GrowthCo",
    status: "rejected" as const,
    appliedDays: 21,
    logo: "https://images.unsplash.com/photo-1560472355-536de3962603?w=40&h=40&fit=crop&crop=entropy"
  }
];

const statusLabels = {
  applied: "Beworben",
  shortlist: "Shortlist", 
  interview: "Interview",
  rejected: "Abgelehnt",
  hired: "Eingestellt"
};

export function ApplicationsList() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleOpenChat = (applicationId: number) => {
    navigate(`/messages?application=${applicationId}`);
  };

  const handleArchiveApplication = (applicationId: number, title: string) => {
    toast({
      title: "Bewerbung archiviert",
      description: `${title} wurde erfolgreich archiviert.`,
    });
  };

  return (
    <GlassCard variant="surface" className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Meine Bewerbungen
        </h2>
        <Button 
          variant="ghost" 
          className="text-cb-primary font-ui font-medium"
          onClick={() => navigate('/applications')}
        >
          Alle anzeigen
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {applications.map((app) => (
          <div 
            key={app.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-cb-surface/50 transition-smooth"
          >
            <div className="flex items-center gap-4">
              <img 
                src={app.logo}
                alt={app.company}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-ui font-medium text-foreground">{app.title}</h3>
                <p className="text-sm text-muted-foreground">{app.company}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <StatusBadge variant={app.status}>
                {statusLabels[app.status]}
              </StatusBadge>
              <span className="text-sm text-muted-foreground font-ui">
                vor {app.appliedDays} Tag{app.appliedDays !== 1 ? 'en' : ''}
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-cb-primary"
                  onClick={() => handleOpenChat(app.id)}
                  title="Chat öffnen"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-cb-danger"
                  onClick={() => handleArchiveApplication(app.id, app.title)}
                  title="Bewerbung archivieren"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}