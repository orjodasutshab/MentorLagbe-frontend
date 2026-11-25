import { Skeleton } from "@/components/ui";

export default function SiteLoading() {
  return (
    <div className="container-x space-y-6 py-12" aria-busy="true">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-5 w-96 max-w-full" />
      <div className="grid gap-6 pt-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-72" />
        ))}
      </div>
    </div>
  );
}
