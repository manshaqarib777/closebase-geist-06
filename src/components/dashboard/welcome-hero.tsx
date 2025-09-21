import { GlassCard } from "@/components/ui/glass-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface WelcomeHeroProps {
  firstName?: string;
  profileCompletion?: number;
}

export function WelcomeHero({ 
  firstName = "Max", 
  profileCompletion = 85 
}: WelcomeHeroProps) {
  const navigate = useNavigate();

  return (
    <GlassCard variant="hero" className="mb-8">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Willkommen zurück, {firstName} 👋
            </h1>
            <p className="text-lg font-ui text-muted-foreground">
              Dein Profil ist zu {profileCompletion}% vollständig. Vervollständige es für bessere Chancen.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              className="bg-cb-primary hover:bg-cb-primary-700 text-white font-ui font-medium px-6"
              onClick={() => navigate('/profile')}
            >
              Profil vervollständigen
            </Button>
            <Button 
              variant="outline" 
              className="border-border/60 font-ui font-medium"
              onClick={() => navigate('/assessment')}
            >
              Assessment abschließen
            </Button>
          </div>
        </div>
        
        <div className="hidden md:flex flex-col items-center gap-3">
          <ProgressRing value={profileCompletion} size={100} />
          <span className="text-sm font-ui text-muted-foreground">Profil-Vollständigkeit</span>
        </div>
      </div>
    </GlassCard>
  );
}