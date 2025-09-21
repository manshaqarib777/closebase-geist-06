import { useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface FitTooltipProps {
  reasons?: string[];
  className?: string;
}

export function FitTooltip({ 
  reasons = [
    "Passende Branchenerfahrung (SaaS)",
    "Gewünschte Dealgröße (€50k-100k)",
    "Sales-Zyklus-Komfort (3-6 Monate)",
    "Standort-Match (München/Remote)"
  ],
  className 
}: FitTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        className="focus-ring h-6 w-6 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center"
        aria-label="Warum dieser Fit?"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
      >
        <Info className="w-3 h-3 text-foreground/60" />
      </button>
      
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-64 tw-card p-3 shadow-lg z-50">
          <h4 className="font-heading font-semibold text-sm mb-2">Warum dieser Fit?</h4>
          <ul className="text-xs space-y-1 text-foreground/80 font-ui">
            {reasons.map((reason, index) => (
              <li key={index}>• {reason}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}