export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-1 items-center justify-center" role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-4">
        <span className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm font-semibold text-muted">Loading MentorLagbe...</p>
      </div>
    </div>
  );
}
