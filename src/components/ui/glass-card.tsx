import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hero" | "surface";
  blur?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", blur = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden transition-smooth",
          variant === "hero" && [
            "bg-gradient-hero p-8 rounded-lg shadow-glass",
            blur && "backdrop-blur-sm"
          ],
          variant === "surface" && [
            "bg-cb-surface border border-border/50 p-6 rounded-lg shadow-cb-md",
          ],
          variant === "default" && [
            "bg-card border border-border/50 p-6 rounded-lg shadow-cb-sm",
          ],
          className
        )}
        {...props}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };