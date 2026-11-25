"use client";

import { Badge, EmptyState, ErrorBox, PageTitle, StatCard, TableSkeleton } from "@/components/ui";
import { formatDate, money } from "@/lib/format";
import { useApi } from "@/lib/hooks";
import type { Payment } from "@/lib/types";

export default function AdminTransactionsPage() {
  const { data, loading, error, reload } = useApi<{ items: Payment[] }>("/admin/transactions");
  const items = data?.items || [];
  const total = items.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <PageTitle title="Transactions" subtitle="Every Stripe subscription payment on the platform." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Revenue" value={loading ? "-" : money(total, "USD")} icon="dollar" />
        <StatCard label="Payments" value={loading ? "-" : items.length} icon="card" />
      </div>

      <div className="card overflow-hidden">
        {error ? (
          <div className="p-5"><ErrorBox message={error} onRetry={reload} /></div>
        ) : loading ? (
          <TableSkeleton />
        ) : items.length === 0 ? (
          <EmptyState title="No transactions yet" text="Payments will appear here after users upgrade to Pro." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>User</th><th>Role</th><th>Plan</th><th>Amount</th><th>Transaction ID</th><th>Date</th></tr></thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p._id}>
                    <td><p className="font-semibold">{p.userName}</p><p className="text-xs text-muted">{p.userEmail}</p></td>
                    <td><Badge value={p.userRole} /></td>
                    <td className="whitespace-nowrap">{p.planName}</td>
                    <td className="whitespace-nowrap font-semibold">{money(p.amount, p.currency)}</td>
                    <td className="max-w-[14rem] truncate font-mono text-xs text-muted" title={p.transactionId}>{p.transactionId}</td>
                    <td className="whitespace-nowrap text-muted">{formatDate(p.paidAt)}</td>
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
