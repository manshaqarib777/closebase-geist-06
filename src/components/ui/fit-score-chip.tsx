import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FitScoreChipProps {
  score: number;
  reasons?: string[];
  className?: string;
}

export function FitScoreChip({ score, reasons = [], className }: FitScoreChipProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "tw-bg-green-500 tw-text-white";
    if (score >= 75) return "tw-bg-blue-500 tw-text-white"; 
    if (score >= 60) return "tw-bg-amber-500 tw-text-white";
    return "tw-bg-gray-500 tw-text-white";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "tw-inline-flex tw-items-center tw-gap-2 tw-px-3 tw-py-1.5 tw-rounded-full tw-font-semibold tw-text-sm tw-transition-all",
            getScoreColor(score),
            "tw-cursor-help hover:tw-scale-105",
            className
          )}>
            <span className="tw-text-xs tw-opacity-90">FIT</span>
            <span className="tw-font-bold">{score}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="tw-max-w-xs">
          <div className="tw-space-y-2">
            <p className="tw-font-medium">Warum passt du:</p>
            <ul className="tw-space-y-1">
              {reasons.map((reason, index) => (
                <li key={index} className="tw-text-sm">
                  • {reason}
                </li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}