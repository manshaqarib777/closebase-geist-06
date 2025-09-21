import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("tw-skeleton", className)} {...props} />;
}

function ApplicationSkeleton() {
  return (
    <li>
      <div className="grid grid-cols-[40px_1fr_auto] gap-3 items-center py-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-9 w-16 rounded-xl" />
        </div>
      </div>
    </li>
  );
}

function JobCardSkeleton() {
  return (
    <div className="tw-card p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-16 rounded-xl" />
        <Skeleton className="h-9 w-20 rounded-xl" />
      </div>
    </div>
  );
}

export { Skeleton, ApplicationSkeleton, JobCardSkeleton };
