import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, subtitle, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-card border border-border/50 rounded-lg p-6 shadow-cb-sm transition-smooth hover:shadow-cb-md",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-ui text-muted-foreground">{title}</p>
          <p className="text-3xl font-heading font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-sm font-ui text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-ui font-medium",
            trend.isPositive 
              ? "bg-cb-success/10 text-cb-success" 
              : "bg-cb-danger/10 text-cb-danger"
          )}>
            {trend.isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
    </div>
  );
}