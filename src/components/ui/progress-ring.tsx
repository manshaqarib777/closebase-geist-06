import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  size?: number;
  label?: string;
  className?: string;
}

export function ProgressRing({ value, size = 40, label, className }: ProgressRingProps) {
  const radius = size / 2 - 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(100, Math.max(0, value)) / 100);

  return (
    <div 
      className={cn("relative", className)} 
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[11px] font-medium text-foreground">
        {label || value}
      </div>
    </div>
  );
}