import { ProgressRing } from "@/components/ui/progress-ring";
import { useNavigate } from "react-router-dom";

interface DashboardSidebarProps {
  assessmentScore?: number | null;
  assessmentLevel?: string;
  assessmentAttemptsLeft?: number;
}

export function DashboardSidebar({ 
  assessmentScore = null,
  assessmentLevel = "Gold",
  assessmentAttemptsLeft = 2
}: DashboardSidebarProps) {
  const navigate = useNavigate();

  // Mock user profile data
  const profileChecks = [
    { label: "CV hochgeladen", checked: true },
    { label: "Video vorgestellt", checked: false },
    { label: "Sprachen gepflegt", checked: true },
    { label: "Ø Dealgröße eingetragen", checked: true },
    { label: "Referenzen hinzugefügt", checked: false }
  ];

  const proTips = [
    "Personalisiere deine Bewerbungen – +18 % Antwortquote.",
    "Füge Sales-KPIs (z. B. Close-Rate, ACV) zu deinem Profil.",
    "Halte LinkedIn aktiv – +40 % Recruiter-Interesse."
  ];

  return (
    <aside className="lg:col-span-4 space-y-5">
      {/* Assessment */}
      <div className="tw-card p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-heading font-semibold">SCI Sales Assessment</h3>
          {assessmentScore !== null && (
            <ProgressRing value={assessmentScore} size={48} label="Score" />
          )}
        </div>
        {assessmentScore === null ? (
          <>
            <p className="text-sm text-foreground/70 mt-2 font-ui">
              Erhalte ein Badge und bessere Matches durch einen kurzen Test (10 Min.).
            </p>
            <button 
              onClick={() => navigate('/assessment')}
              className="focus-ring tw-btn-outline mt-3"
            >
              Assessment starten (10 Min)
            </button>
            <p className="text-xs text-foreground/60 mt-2 font-ui">
              Verfügbar: {assessmentAttemptsLeft}/2 Versuche
            </p>
          </>
        ) : (
          <>
            <ul className="text-sm text-foreground/80 mt-2 space-y-1 font-ui">
              <li>Top-Stärken: Kommunikation, Lead Mgmt.</li>
              <li>Empfehlung: Closing-Techniken schärfen</li>
            </ul>
            <button 
              onClick={() => navigate('/assessment')}
              className="focus-ring tw-btn-secondary mt-3"
            >
              Bericht ansehen
            </button>
          </>
        )}
      </div>

      {/* Profil-Status */}
      <div className="tw-card p-4">
        <h3 className="font-heading font-semibold mb-2">Profil-Status</h3>
        <ul className="space-y-2 text-sm font-ui">
          {profileChecks.map((check, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                check.checked 
                  ? 'bg-primary border-primary' 
                  : 'border-border bg-background'
              }`}>
                {check.checked && (
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="focus-ring text-left hover:text-primary flex-1"
              >
                {check.label}
              </button>
            </li>
          ))}
        </ul>
        <button 
          onClick={() => navigate('/profile')}
          className="focus-ring tw-btn-secondary mt-3"
        >
          Profil bearbeiten
        </button>
      </div>

      {/* Pro-Tipps */}
      <div className="tw-card p-4">
        <h3 className="font-heading font-semibold mb-2">Pro-Tipps</h3>
        <ol className="space-y-2 text-sm list-decimal pl-5 font-ui">
          {proTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ol>
      </div>
    </aside>
  );
}