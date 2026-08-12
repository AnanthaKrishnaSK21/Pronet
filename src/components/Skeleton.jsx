export function Skeleton({ className = "" }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-3xl glass p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-11 h-11 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <Skeleton className="h-9 w-full rounded-2xl mt-2" />
    </div>
  );
}
