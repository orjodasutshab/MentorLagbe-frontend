"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/icons";
import TuitionBanner from "@/components/TuitionBanner";
import { Badge, EmptyState, ErrorBox, PageTitle, TableSkeleton } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { formatDate, money } from "@/lib/format";
import { useApi } from "@/lib/hooks";
import type { Tuition } from "@/lib/types";

export default function MyTuitionsPage() {
  const { data, loading, error, reload } = useApi<{ items: Tuition[] }>("/tuitions/tutor/mine");
  const [busyId, setBusyId] = useState<string | null>(null);
  const items = data?.items || [];

  async function toggleActive(t: Tuition) {
    setBusyId(t._id);
    try {
      await api(`/tuitions/${t._id}`, { method: "PATCH", body: { isActive: !t.isActive } });
      toast.success(t.isActive ? "Tuition closed" : "Tuition re-opened");
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  async function remove(t: Tuition) {
    if (!window.confirm(`Delete "${t.title}"? This cannot be undone.`)) return;
    setBusyId(t._id);
    try {
      await api(`/tuitions/${t._id}`, { method: "DELETE" });
      toast.success("Tuition deleted");
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <PageTitle
        title="My Tuitions"
        subtitle="Edit, close or delete the listings you created."
        action={<Link href="/dashboard/tutor/post-tuition" className="btn btn-primary"><Icon name="plus" size={16} /> New tuition</Link>}
      />
      <div className="card overflow-hidden">
        {error ? (
          <div className="p-5"><ErrorBox message={error} onRetry={reload} /></div>
        ) : loading ? (
          <TableSkeleton />
        ) : items.length === 0 ? (
          <EmptyState title="No tuitions yet" text="Post your first tuition to start getting applicants." action={<Link href="/dashboard/tutor/post-tuition" className="btn btn-primary">Post a tuition</Link>} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Tuition</th><th>Fee</th><th>Approval</th><th>Status</th><th>Applicants</th><th>Posted</th><th /></tr>
              </thead>
              <tbody>
                {items.map((t) => (
                  <tr key={t._id}>
                    <td className="min-w-[16rem]">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg"><TuitionBanner image={t.bannerImage} subject={t.subject} /></div>
                        <div className="min-w-0">
                          <p className="font-semibold leading-snug">{t.title}</p>
                          <p className="text-xs text-muted">{t.subject} · {t.classLevel}</p>
                          {t.approvalStatus === "rejected" && t.rejectionReason ? (
                            <p className="mt-0.5 text-xs text-danger">Reason: {t.rejectionReason}</p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap font-semibold">{money(t.monthlyFee)}</td>
                    <td><Badge value={t.approvalStatus} /></td>
                    <td><Badge value={t.isActive ? "active" : "closed"} label={t.isActive ? "Active" : "Closed"} /></td>
                    <td>{t.applicantCount ?? 0}</td>
                    <td className="whitespace-nowrap text-muted">{formatDate(t.createdAt)}</td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button className="btn btn-outline btn-sm" disabled={busyId === t._id} onClick={() => toggleActive(t)}>
                          {t.isActive ? "Close" : "Re-open"}
                        </button>
                        <Link href={`/dashboard/tutor/my-tuitions/${t._id}/edit`} className="btn btn-outline btn-sm"><Icon name="edit" size={14} /> Edit</Link>
                        <button className="btn btn-danger btn-sm" disabled={busyId === t._id} onClick={() => remove(t)}><Icon name="trash" size={14} /></button>
                      </div>
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
