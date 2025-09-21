import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface PipelineStepBarProps {
  stats: {
    applied: number;
    shortlisted: number;
    interview: number;
    hired: number;
    rejected: number;
    total: number;
  };
}

export function PipelineStepBar({ stats }: PipelineStepBarProps) {
  const steps = [
    { key: 'applied', label: 'Beworben', count: stats.applied, color: 'bg-gray-500' },
    { key: 'shortlisted', label: 'Shortlist', count: stats.shortlisted, color: 'bg-blue-500' },
    { key: 'interview', label: 'Interview', count: stats.interview, color: 'bg-amber-500' },
    { key: 'hired', label: 'Eingestellt', count: stats.hired, color: 'bg-green-500' }
  ];

  // Calculate overall progress percentage
  const progressValue = stats.total > 0 ? Math.round(
    ((stats.applied * 0) + (stats.shortlisted * 25) + (stats.interview * 50) + (stats.hired * 100)) / stats.total
  ) : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold mb-2",
              step.color
            )}>
              {step.count}
            </div>
            <span className="text-xs text-gray-600 font-medium">{step.label}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Gesamt-Fortschritt</span>
          <span className="text-sm text-gray-600">{progressValue}%</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      {/* Summary stats */}
      <div className="flex justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
        <span>Gesamt: {stats.total}</span>
        <span>Erfolgsrate: {stats.total > 0 ? Math.round((stats.hired / stats.total) * 100) : 0}%</span>
        {stats.rejected > 0 && <span>Abgelehnt: {stats.rejected}</span>}
      </div>
    </div>
  );
}