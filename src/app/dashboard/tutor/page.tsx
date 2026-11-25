"use client";

import Link from "next/link";
import { Badge, EmptyState, ErrorBox, PageTitle, StatCard, TableSkeleton } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { formatDate, money } from "@/lib/format";
import { useApi } from "@/lib/hooks";
import type { Application, Tuition } from "@/lib/types";

interface MineResponse {
  items: Tuition[];
  totalPosted: number;
  remainingFreePosts: number | null;
}

export default function TutorOverview() {
  const { user } = useAuth();
  const mine = useApi<MineResponse>("/tuitions/tutor/mine");
  const apps = useApi<{ items: Application[] }>("/applications/tutor");

  const tuitions = mine.data?.items || [];
  const approved = tuitions.filter((t) => t.approvalStatus === "approved" && t.isActive).length;
  const applicants = apps.data?.items.length ?? 0;
  const busy = mine.loading || apps.loading;

  return (
    <div>
      <PageTitle
        title={`Welcome, ${user?.name.split(" ")[0] || "Tutor"}`}
        subtitle="Your listings and applicants at a glance."
        action={<Link href="/dashboard/tutor/post-tuition" className="btn btn-primary">Post a tuition</Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Tuitions Posted" value={busy ? "-" : mine.data?.totalPosted ?? 0} icon="book" />
        <StatCard label="Active / Approved" value={busy ? "-" : approved} icon="checkCircle" />
        <StatCard label="Applicants Received" value={busy ? "-" : applicants} icon="users" />
        <StatCard
          label="Current Plan"
          value={user?.plan === "pro" ? "Pro" : "Free"}
          icon="zap"
          hint={user?.plan === "pro" ? "Unlimited posts" : `${mine.data?.remainingFreePosts ?? 2} free post(s) left`}
        />
      </div>

      {user?.plan !== "pro" ? (
        <div className="card mt-6 flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="font-bold">Upgrade to Pro Tutor for $15</p>
            <p className="text-sm text-muted">Unlimited tuition posts and a verified Pro badge.</p>
          </div>
          <Link href="/pricing" className="btn btn-outline">See plans</Link>
        </div>
      ) : null}

      <div className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-bold">Your latest tuitions</h2>
          <Link href="/dashboard/tutor/my-tuitions" className="text-sm font-semibold text-primary">Manage</Link>
        </div>
        {mine.error ? (
          <div className="p-5"><ErrorBox message={mine.error} onRetry={mine.reload} /></div>
        ) : mine.loading ? (
          <TableSkeleton rows={4} />
        ) : tuitions.length === 0 ? (
          <EmptyState title="No tuitions posted" text="Create your first listing to start receiving applicants." action={<Link href="/dashboard/tutor/post-tuition" className="btn btn-primary">Post a tuition</Link>} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Title</th><th>Fee</th><th>Posted</th><th>Approval</th><th>Applicants</th></tr></thead>
              <tbody>
                {tuitions.slice(0, 5).map((t) => (
                  <tr key={t._id}>
                    <td className="font-semibold">{t.title}</td>
                    <td>{money(t.monthlyFee)}</td>
                    <td className="text-muted">{formatDate(t.createdAt)}</td>
                    <td><Badge value={t.approvalStatus} /></td>
                    <td>{t.applicantCount ?? 0}</td>
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
