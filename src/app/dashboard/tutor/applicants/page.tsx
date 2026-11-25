"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge, EmptyState, ErrorBox, PageTitle, TableSkeleton } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { useApi } from "@/lib/hooks";
import type { Application } from "@/lib/types";

export default function ApplicantsPage() {
  const { data, loading, error, reload } = useApi<{ items: Application[] }>("/applications/tutor");
  const [busyId, setBusyId] = useState<string | null>(null);
  const items = data?.items || [];

  async function setStatus(a: Application, status: "accepted" | "rejected") {
    setBusyId(a._id);
    try {
      await api(`/applications/${a._id}/status`, { method: "PATCH", body: { status } });
      toast.success(`Application ${status}`);
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <PageTitle title="Manage Applicants" subtitle="Review students who applied to your tuitions." />
      <div className="card overflow-hidden">
        {error ? (
          <div className="p-5"><ErrorBox message={error} onRetry={reload} /></div>
        ) : loading ? (
          <TableSkeleton />
        ) : items.length === 0 ? (
          <EmptyState title="No applicants yet" text="Applications will show up here as soon as students apply." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Student</th><th>Contact</th><th>Tuition</th><th>Schedule &amp; note</th><th>Applied</th><th>Status</th><th /></tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a._id}>
                    <td className="min-w-[10rem]">
                      <p className="font-semibold">{a.studentName}</p>
                      <p className="text-xs text-muted">{a.studentEmail}</p>
                    </td>
                    <td className="whitespace-nowrap">{a.studentPhone}</td>
                    <td className="min-w-[12rem] font-medium">{a.tuitionTitle}</td>
                    <td className="min-w-[15rem]">
                      <p className="text-xs font-semibold">{a.preferredSchedule}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted">{a.studentNote}</p>
                    </td>
                    <td className="whitespace-nowrap text-muted">{formatDate(a.appliedAt)}</td>
                    <td><Badge value={a.status} /></td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button className="btn btn-primary btn-sm" disabled={busyId === a._id || a.status === "accepted"} onClick={() => setStatus(a, "accepted")}>Accept</button>
                        <button className="btn btn-danger btn-sm" disabled={busyId === a._id || a.status === "rejected"} onClick={() => setStatus(a, "rejected")}>Reject</button>
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
