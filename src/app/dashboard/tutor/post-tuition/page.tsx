"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import TuitionForm, { type TuitionFormValues } from "@/components/TuitionForm";
import { PageTitle, Skeleton } from "@/components/ui";
import { api, ApiError, errorMessage } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import type { Tuition } from "@/lib/types";

interface MineResponse {
  items: Tuition[];
  totalPosted: number;
  plan: string;
  remainingFreePosts: number | null;
}

export default function PostTuitionPage() {
  const router = useRouter();
  const { data, loading } = useApi<MineResponse>("/tuitions/tutor/mine");
  const limitReached = Boolean(data && data.plan !== "pro" && (data.remainingFreePosts ?? 0) <= 0);

  async function onSubmit(values: TuitionFormValues) {
    try {
      await api("/tuitions", { method: "POST", body: values });
      toast.success("Tuition submitted. It will appear publicly once an admin approves it.");
      router.push("/dashboard/tutor/my-tuitions");
    } catch (err) {
      if (err instanceof ApiError && err.code === "POST_LIMIT_REACHED") {
        toast.error("You reached the free plan limit. Upgrade to Pro for unlimited posts.");
      } else {
        toast.error(errorMessage(err));
      }
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle
        title="Post a Tuition"
        subtitle={
          data && data.plan !== "pro"
            ? `Free plan: ${data.remainingFreePosts ?? 0} post(s) remaining.`
            : "Pro plan: post as many tuitions as you like."
        }
      />

      {loading ? (
        <Skeleton className="h-96 w-full" />
      ) : limitReached ? (
        <div className="card p-8 text-center">
          <h2 className="text-xl font-extrabold">Free plan limit reached</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Free tutors can post up to 2 tuition listings. Upgrade to Pro Tutor to post unlimited tuitions.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/pricing" className="btn btn-primary">Upgrade to Pro</Link>
            <Link href="/dashboard/tutor/my-tuitions" className="btn btn-outline">Manage my tuitions</Link>
          </div>
        </div>
      ) : (
        <TuitionForm submitLabel="Submit for approval" onSubmit={onSubmit} />
      )}
    </div>
  );
}
