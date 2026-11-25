"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import TuitionForm, { type TuitionFormValues } from "@/components/TuitionForm";
import { ErrorBox, PageTitle, Skeleton } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import type { Tuition } from "@/lib/types";

export default function EditTuitionPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { data, loading, error, reload } = useApi<{ tuition: Tuition }>(id ? `/tuitions/${id}` : null);

  async function onSubmit(values: TuitionFormValues) {
    try {
      const res = await api<{ sentForReview?: boolean }>(`/tuitions/${id}`, { method: "PATCH", body: values });
      toast.success(
        res.sentForReview
          ? "Changes saved. The listing was sent back to admins for review."
          : "Tuition updated successfully.",
      );
      router.push("/dashboard/tutor/my-tuitions");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle title="Edit Tuition" subtitle="Changing an approved listing sends it back for admin review." action={<Link href="/dashboard/tutor/my-tuitions" className="btn btn-outline btn-sm">Back</Link>} />
      {loading ? (
        <Skeleton className="h-96 w-full" />
      ) : error || !data ? (
        <ErrorBox message={error || "Tuition not found."} onRetry={reload} />
      ) : (
        <TuitionForm initial={data.tuition} submitLabel="Save changes" onSubmit={onSubmit} />
      )}
    </div>
  );
}
