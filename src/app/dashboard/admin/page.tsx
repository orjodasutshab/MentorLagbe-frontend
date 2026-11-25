"use client";

import Link from "next/link";
import { Badge, ErrorBox, PageTitle, StatCard, TableSkeleton } from "@/components/ui";
import { formatDate, money } from "@/lib/format";
import { useApi } from "@/lib/hooks";
import type { Payment } from "@/lib/types";

interface Overview {
  totalUsers: number;
  totalStudents: number;
  totalTutors: number;
  pendingTuitions: number;
  approvedTuitions: number;
  totalApplications: number;
  totalRevenue: number;
  recentPayments: Payment[];
}

export default function AdminOverview() {
  const { data, loading, error, reload } = useApi<Overview>("/admin/overview");
  const v = (n?: number) => (loading || n === undefined ? "-" : n);

  return (
    <div>
      <PageTitle title="Admin Overview" subtitle="Platform statistics across users, tuitions and revenue." />
      {error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Users" value={v(data?.totalUsers)} icon="users" hint={data ? `${data.totalStudents} students` : undefined} />
            <StatCard label="Total Tutors" value={v(data?.totalTutors)} icon="cap" />
            <StatCard label="Pending vs Approved" value={loading || !data ? "-" : `${data.pendingTuitions} / ${data.approvedTuitions}`} icon="clock" hint="Tuition posts" />
            <StatCard label="Total Stripe Revenue" value={loading || !data ? "-" : money(data.totalRevenue, "USD")} icon="dollar" />
          </div>

          <div className="card mt-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-bold">Recent payments</h2>
              <Link href="/dashboard/admin/transactions" className="text-sm font-semibold text-primary">View all</Link>
            </div>
            {loading ? (
              <TableSkeleton rows={4} />
            ) : !data || data.recentPayments.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted">No payments yet.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>User</th><th>Role</th><th>Plan</th><th>Amount</th><th>Date</th></tr></thead>
                  <tbody>
                    {data.recentPayments.map((p) => (
                      <tr key={p._id}>
                        <td><p className="font-semibold">{p.userName}</p><p className="text-xs text-muted">{p.userEmail}</p></td>
                        <td><Badge value={p.userRole} /></td>
                        <td>{p.planName}</td>
                        <td className="font-semibold">{money(p.amount, p.currency)}</td>
                        <td className="text-muted">{formatDate(p.paidAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
