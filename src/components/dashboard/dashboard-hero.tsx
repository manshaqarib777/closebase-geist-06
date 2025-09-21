import { ProgressRing } from "@/components/ui/progress-ring";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardHeroProps {
  firstName?: string;
  profileCompletion?: number;
  unreadMessages?: number;
  assessmentAttemptsLeft?: number;
  assessmentScore?: number | null;
}

export function DashboardHero({ 
  firstName = "Max", 
  profileCompletion = 85,
  unreadMessages = 0,
  assessmentAttemptsLeft = 2,
  assessmentScore = null
}: DashboardHeroProps) {
  const navigate = useNavigate();

  return (
    <section className="tw-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-[22px] font-heading font-semibold text-foreground">
          Willkommen zurück, {firstName} 👋
        </h1>
        <p className="text-foreground/70 font-ui">
          Vervollständige dein Profil und Assessment für bessere Matches.
        </p>
        <div className="mt-3 flex gap-2 flex-wrap">
          <button 
            className="focus-ring tw-btn-outline"
            onClick={() => navigate('/profile')}
            aria-label="Profil vervollständigen"
          >
            Profil vervollständigen
          </button>
          <button 
            className="focus-ring tw-btn-secondary"
            onClick={() => navigate('/assessment')}
            aria-label={assessmentScore === null ? "Assessment starten (10 Min)" : "Assessment-Bericht ansehen"}
          >
            {assessmentScore === null ? "Assessment starten (10 Min)" : "Bericht ansehen"}
          </button>
          {assessmentAttemptsLeft !== null && assessmentScore === null && (
            <span className="tw-chip">
              Versuche verfügbar: {assessmentAttemptsLeft}/2
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <ProgressRing value={profileCompletion} size={64} label="%" />
        <div className="text-sm text-foreground/60 font-ui">
          Profil: <span className="font-medium">{profileCompletion}%</span><br/>
          Ungelesen: {unreadMessages}
        </div>
      </div>
    </section>
  );
}