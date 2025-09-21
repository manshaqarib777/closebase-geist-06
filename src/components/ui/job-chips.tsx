import { cn } from "@/lib/utils";

interface JobChipProps {
  children: React.ReactNode;
  variant: 'violet' | 'blue' | 'green' | 'orange';
  className?: string;
}

export function JobChip({ children, variant, className }: JobChipProps) {
  const variantStyles = {
    violet: 'bg-violet-100 text-violet-800 border-violet-300 font-semibold',  // Ø Provision
    blue: 'bg-blue-100 text-blue-800 border-blue-300 font-semibold',         // Stunden
    green: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold', // Leads
    orange: 'bg-orange-100 text-orange-800 border-orange-300 font-semibold'    // Sales-Zyklus
  };

  return (
    <span className={cn(
      'inline-flex items-center h-6 px-2.5 rounded-full text-xs border',
      variantStyles[variant],
      className
    )}>
      {children}
    </span>
  );
}