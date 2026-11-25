"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/icons";
import { Badge, EmptyState, ErrorBox, PageTitle, TableSkeleton } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { formatDate, money } from "@/lib/format";
import { useApi } from "@/lib/hooks";
import type { Application } from "@/lib/types";

export default function MyApplicationsPage() {
  const { data, loading, error, reload } = useApi<{ items: Application[] }>("/applications/student");
  const [busyId, setBusyId] = useState<string | null>(null);
  const items = data?.items || [];

  async function cancel(a: Application) {
    if (!window.confirm(`Cancel your application for "${a.tuitionTitle}"?`)) return;
    setBusyId(a._id);
    try {
      await api(`/applications/${a._id}`, { method: "DELETE" });
      toast.success("Application cancelled");
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <PageTitle title="My Applications" subtitle="Track every tuition you have applied for." />
      <div className="card overflow-hidden">
        {error ? (
          <div className="p-5"><ErrorBox message={error} onRetry={reload} /></div>
        ) : loading ? (
          <TableSkeleton />
        ) : items.length === 0 ? (
          <EmptyState title="You have not applied yet" text="Browse approved tuitions and apply to start learning." action={<Link href="/tuitions" className="btn btn-primary">Browse tuitions</Link>} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Tuition</th><th>Tutor</th><th>Monthly fee</th><th>Applied date</th><th>Status</th><th /></tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a._id}>
                    <td className="min-w-[14rem]">
                      <Link href={`/tuitions/${a.tuitionId}`} className="font-semibold hover:text-primary">{a.tuitionTitle}</Link>
                      <p className="text-xs text-muted">{a.subject}</p>
                    </td>
                    <td>
                      <p className="font-semibold">{a.tutorName}</p>
                      <p className="text-xs text-muted">{a.tutorEmail}</p>
                    </td>
                    <td className="whitespace-nowrap font-semibold">{money(a.monthlyFee)}</td>
                    <td className="whitespace-nowrap text-muted">{formatDate(a.appliedAt)}</td>
                    <td><Badge value={a.status} /></td>
                    <td className="text-right">
                      {a.status === "pending" ? (
                        <button className="btn btn-danger btn-sm" disabled={busyId === a._id} onClick={() => cancel(a)}>
                          <Icon name="trash" size={14} /> Cancel
                        </button>
                      ) : null}
                    </td>
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
