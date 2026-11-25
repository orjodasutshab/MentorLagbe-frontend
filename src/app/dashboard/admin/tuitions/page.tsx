"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import TuitionBanner from "@/components/TuitionBanner";
import { Badge, EmptyState, ErrorBox, PageTitle, TableSkeleton } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { formatDate, money } from "@/lib/format";
import { useApi } from "@/lib/hooks";
import type { Tuition } from "@/lib/types";

const TABS = ["all", "pending", "approved", "rejected"] as const;

export default function AdminTuitionsPage() {
  const [status, setStatus] = useState<(typeof TABS)[number]>("pending");
  const { data, loading, error, reload } = useApi<{ items: Tuition[] }>(`/admin/tuitions?status=${status}`);
  const [busyId, setBusyId] = useState<string | null>(null);
  const items = data?.items || [];

  async function moderate(t: Tuition, approvalStatus: "approved" | "rejected") {
    let rejectionReason: string | undefined;
    if (approvalStatus === "rejected") {
      const reason = window.prompt("Reason for rejection (optional):", "");
      if (reason === null) return;
      rejectionReason = reason.trim() || undefined;
    }
    setBusyId(t._id);
    try {
      await api(`/admin/tuitions/${t._id}`, { method: "PATCH", body: { approvalStatus, rejectionReason } });
      toast.success(`Tuition ${approvalStatus}`);
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <PageTitle title="Tuition Approval" subtitle="Review tuitions submitted by tutors. Only approved, active ones appear publicly." />

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setStatus(tab)} className={`btn btn-sm capitalize ${status === tab ? "btn-primary" : "btn-outline"}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {error ? (
          <div className="p-5"><ErrorBox message={error} onRetry={reload} /></div>
        ) : loading ? (
          <TableSkeleton />
        ) : items.length === 0 ? (
          <EmptyState title={`No ${status === "all" ? "" : status} tuitions`} text="Nothing to review here right now." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Tuition</th><th>Tutor</th><th>Fee</th><th>Posted</th><th>Approval</th><th /></tr></thead>
              <tbody>
                {items.map((t) => (
                  <tr key={t._id}>
                    <td className="min-w-[16rem]">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg"><TuitionBanner image={t.bannerImage} subject={t.subject} /></div>
                        <div className="min-w-0">
                          <Link href={`/tuitions/${t._id}`} className="font-semibold leading-snug hover:text-primary">{t.title}</Link>
                          <p className="text-xs text-muted">{t.subject} · {t.classLevel} · {t.mode}</p>
                        </div>
                      </div>
                    </td>
                    <td><p className="font-semibold">{t.tutorName}</p><p className="text-xs text-muted">{t.tutorEmail}</p></td>
                    <td className="whitespace-nowrap font-semibold">{money(t.monthlyFee)}</td>
                    <td className="whitespace-nowrap text-muted">{formatDate(t.createdAt)}</td>
                    <td><Badge value={t.approvalStatus} /></td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button className="btn btn-primary btn-sm" disabled={busyId === t._id || t.approvalStatus === "approved"} onClick={() => moderate(t, "approved")}>Approve</button>
                        <button className="btn btn-danger btn-sm" disabled={busyId === t._id || t.approvalStatus === "rejected"} onClick={() => moderate(t, "rejected")}>Reject</button>
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
