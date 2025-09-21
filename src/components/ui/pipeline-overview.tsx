import { cn } from "@/lib/utils";

interface PipelineStep {
  label: string;
  count: number;
}

interface PipelineOverviewProps {
  steps: PipelineStep[];
  totalApplications: number;
  averageProgress: number;
  className?: string;
}

export function PipelineOverview({ 
  steps, 
  totalApplications, 
  averageProgress, 
  className 
}: PipelineOverviewProps) {
  return (
    <div className={cn("bg-card rounded-lg border border-border p-4 mb-6", className)}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          {steps.map((step, index) => (
            <div key={step.label} className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {step.count}
              </span>
              <span className="text-sm font-medium text-foreground">
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <span className="text-muted mx-2">→</span>
              )}
            </div>
          ))}
        </div>
        <div className="text-sm text-muted">
          Gesamt: {totalApplications}
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-foreground">Fortschritt insgesamt</span>
          <span className="font-medium text-foreground">{averageProgress}%</span>
        </div>
        <div className="h-2 rounded-full bg-surface">
          <div 
            className="h-full rounded-full bg-primary transition-all duration-300" 
            style={{ width: `${averageProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}