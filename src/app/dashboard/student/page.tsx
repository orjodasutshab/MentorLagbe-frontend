"use client";

import Link from "next/link";
import { Badge, EmptyState, ErrorBox, PageTitle, StatCard, TableSkeleton } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { formatDate, money } from "@/lib/format";
import { useApi } from "@/lib/hooks";
import type { Application } from "@/lib/types";

export default function StudentOverview() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useApi<{ items: Application[] }>("/applications/student");
  const items = data?.items || [];
  const accepted = items.filter((a) => a.status === "accepted").length;
  const pending = items.filter((a) => a.status === "pending").length;

  return (
    <div>
      <PageTitle
        title={`Welcome, ${user?.name.split(" ")[0] || "Student"}`}
        subtitle="Here is a quick look at your tuition applications."
        action={<Link href="/tuitions" className="btn btn-primary">Browse tuitions</Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Applied Tuitions" value={loading ? "-" : items.length} icon="file" />
        <StatCard label="Accepted Applications" value={loading ? "-" : accepted} icon="checkCircle" />
        <StatCard label="Pending Applications" value={loading ? "-" : pending} icon="clock" />
        <StatCard label="Current Plan" value={user?.plan === "pro" ? "Pro" : "Free"} icon="zap" hint={user?.plan === "pro" ? "Unlimited bookmarks" : "5 bookmarks included"} />
      </div>

      {user?.plan !== "pro" ? (
        <div className="card mt-6 flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="font-bold">Upgrade to Pro Student for $10</p>
            <p className="text-sm text-muted">Unlimited bookmarks, priority booking and a Pro badge.</p>
          </div>
          <Link href="/pricing" className="btn btn-outline">See plans</Link>
        </div>
      ) : null}

      <div className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-bold">Recent applications</h2>
          <Link href="/dashboard/student/my-applications" className="text-sm font-semibold text-primary">View all</Link>
        </div>
        {error ? (
          <div className="p-5"><ErrorBox message={error} onRetry={reload} /></div>
        ) : loading ? (
          <TableSkeleton rows={4} />
        ) : items.length === 0 ? (
          <EmptyState title="No applications yet" text="Find a tuition you like and apply in one form." action={<Link href="/tuitions" className="btn btn-primary">Browse tuitions</Link>} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Tuition</th><th>Fee</th><th>Applied</th><th>Status</th></tr></thead>
              <tbody>
                {items.slice(0, 5).map((a) => (
                  <tr key={a._id}>
                    <td className="font-semibold">{a.tuitionTitle}</td>
                    <td>{money(a.monthlyFee)}</td>
                    <td className="text-muted">{formatDate(a.appliedAt)}</td>
                    <td><Badge value={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
