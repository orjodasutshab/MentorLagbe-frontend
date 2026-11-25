"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/icons";
import TuitionCard from "@/components/TuitionCard";
import { EmptyState, ErrorBox, PageTitle, TuitionCardSkeleton } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useApi } from "@/lib/hooks";
import type { Tuition } from "@/lib/types";

export default function SavedTuitionsPage() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useApi<{ items: Tuition[] }>("/users/saved-tuitions");
  const [busyId, setBusyId] = useState<string | null>(null);
  const items = data?.items || [];

  async function remove(id: string) {
    setBusyId(id);
    try {
      await api(`/users/saved-tuitions/${id}`, { method: "POST" });
      toast.success("Removed from bookmarks");
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
        title="Saved Tuitions"
        subtitle={user?.plan === "pro" ? "Unlimited bookmarks with Pro." : `Free plan: ${items.length} of 5 bookmarks used.`}
      />
      {error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : loading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (<TuitionCardSkeleton key={i} />))}
        </div>
      ) : items.length === 0 ? (
        <div className="card">
          <EmptyState title="Nothing saved yet" text="Tap Save for later on any tuition to find it here." action={<Link href="/tuitions" className="btn btn-primary">Browse tuitions</Link>} />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((t) => (
            <div key={t._id} className="flex h-full flex-col gap-2">
              <div className="flex-1"><TuitionCard tuition={t} /></div>
              <button className="btn btn-outline btn-sm w-full" disabled={busyId === t._id} onClick={() => remove(t._id)}>
                <Icon name="bookmark" size={14} /> Remove bookmark
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
