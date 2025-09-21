import { cn } from "@/lib/utils";

type StatusVariant = "applied" | "shortlist" | "interview" | "rejected" | "hired" | "boosted" | "sent";

interface StatusBadgeProps {
  variant: StatusVariant;
  children: React.ReactNode;
  className?: string;
}

const statusStyles: Record<StatusVariant, string> = {
  applied: "bg-blue-50 text-blue-700 border-blue-200",
  shortlist: "bg-purple-50 text-purple-700 border-purple-200",
  interview: "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  hired: "bg-green-50 text-green-700 border-green-200",
  boosted: "bg-cb-accent-50 text-cb-accent border-cb-accent/20",
  sent: "bg-blue-50 text-blue-700 border-blue-200",
};

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-ui font-medium transition-smooth",
      statusStyles[variant],
      className
    )}>
      {children}
    </span>
  );
}