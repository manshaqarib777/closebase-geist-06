import { GlassCard } from "@/components/ui/glass-card";
import { Lightbulb, CheckCircle, Circle } from "lucide-react";

const proTips = [
  "Personalisierte Bewerbungstexte steigern Antworten um 18%",
  "Füge KPIs in dein Profil ein (z.B. Close-Rate)",
  "Aktive LinkedIn-Präsenz erhöht Recruiter-Interesse um 40%"
];

const profileChecklist = [
  { item: "CV hochgeladen", completed: true },
  { item: "Video vorgestellt", completed: false },
  { item: "Sprachen hinzugefügt", completed: true },
  { item: "Referenzen eingetragen", completed: true },
  { item: "Sales KPIs dokumentiert", completed: false },
  { item: "Zertifikate hochgeladen", completed: false }
];

export function TipsAndProfile() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <GlassCard variant="surface">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-cb-warning/10 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-cb-warning" />
          </div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Pro-Tipps
          </h3>
        </div>
        
        <div className="space-y-4">
          {proTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-cb-surface/50 rounded-lg">
              <span className="w-6 h-6 bg-cb-primary/10 text-cb-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <p className="text-sm font-ui text-muted-foreground leading-relaxed">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard variant="surface">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-cb-primary/10 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-cb-primary" />
          </div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Profil-Status
          </h3>
        </div>
        
        <div className="space-y-3">
          {profileChecklist.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              {item.completed ? (
                <CheckCircle className="w-5 h-5 text-cb-success" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
              <span className={`text-sm font-ui ${
                item.completed ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {item.item}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex justify-between text-sm font-ui">
            <span className="text-muted-foreground">Vollständigkeit:</span>
            <span className="font-medium text-foreground">
              {profileChecklist.filter(item => item.completed).length}/{profileChecklist.length} abgeschlossen
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}