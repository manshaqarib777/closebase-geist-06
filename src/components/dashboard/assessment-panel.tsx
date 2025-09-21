import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Award, ArrowRight, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AssessmentPanelProps {
  sciScore?: number;
  level?: "Bronze" | "Silber" | "Gold" | "Platin";
  strengths?: string[];
  recommendations?: string[];
}

export function AssessmentPanel({ 
  sciScore,
  level,
  strengths = [],
  recommendations = []
}: AssessmentPanelProps) {
  const navigate = useNavigate();
  const hasAssessment = sciScore !== undefined;

  if (!hasAssessment) {
    return (
      <GlassCard variant="surface" className="mb-8">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-cb-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-cb-primary" />
          </div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            Elite-Vertriebler-Assessment
          </h3>
          <p className="text-muted-foreground font-ui mb-6 max-w-md mx-auto">
            Beweise deine Verkaufsexzellenz in unserem Elite-Assessment. Automatische Freischaltung bei ≥60% der Punkte.
          </p>
          <Button 
            className="bg-cb-primary hover:bg-cb-primary-700 text-white font-ui font-medium"
            onClick={() => navigate('/assessment')}
          >
            <PlayCircle className="w-5 h-5 mr-2" />
            Assessment starten (10 Min)
          </Button>
        </div>
      </GlassCard>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Platin": return "bg-gray-400 text-white";
      case "Gold": return "bg-yellow-500 text-white";
      case "Silber": return "bg-gray-300 text-gray-800";
      default: return "bg-amber-600 text-white";
    }
  };

  return (
    <GlassCard variant="surface" className="mb-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            Elite-Vertriebler-Assessment
          </h3>
          <div className="flex items-center gap-3">
            <StatusBadge variant="applied" className={getLevelColor(level!)}>
              {level} Level
            </StatusBadge>
            <span className="text-2xl font-heading font-bold text-cb-primary">
              {sciScore}/100
            </span>
          </div>
        </div>
        <Award className="w-8 h-8 text-cb-primary" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-ui font-semibold text-foreground mb-3">Top-Stärken</h4>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm font-ui">
                <span className="w-1.5 h-1.5 bg-cb-success rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-ui font-semibold text-foreground mb-3">Empfehlungen</h4>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm font-ui">
                <span className="w-1.5 h-1.5 bg-cb-warning rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-muted-foreground">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border/50">
        <Button 
          variant="ghost" 
          className="text-cb-primary font-ui font-medium"
          onClick={() => navigate('/assessment/result')}
        >
          Vollständigen Bericht anzeigen
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </GlassCard>
  );
}