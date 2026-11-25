"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Avatar from "@/components/Avatar";
import { Icon } from "@/components/icons";
import TuitionBanner from "@/components/TuitionBanner";
import TuitionCard from "@/components/TuitionCard";
import { Badge, ErrorBox, Skeleton, Spinner } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDate, money } from "@/lib/format";
import { useApi } from "@/lib/hooks";
import type { Tuition } from "@/lib/types";

interface DetailResponse {
  tuition: Tuition;
  relatedTuitions: Tuition[];
  viewerState: { hasApplied: boolean; canReview: boolean; hasReviewed: boolean; isSaved: boolean };
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5 text-accent" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" size={15} className={i < value ? "" : "opacity-25"} />
      ))}
    </span>
  );
}

function ApplyModal({ tuition, onClose, onDone }: { tuition: Tuition; onClose: () => void; onDone: () => void }) {
  const { user } = useAuth();
  const [phone, setPhone] = useState(user?.phone || "");
  const [schedule, setSchedule] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (phone.trim().length < 6) err.phone = "Please enter a valid phone number.";
    if (schedule.trim().length < 3) err.schedule = "Tell the tutor your preferred schedule.";
    if (note.trim().length < 5) err.note = "Add a short learning note (5+ characters).";
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    try {
      await api("/applications", {
        method: "POST",
        body: {
          tuitionId: tuition._id,
          studentPhone: phone.trim(),
          preferredSchedule: schedule.trim(),
          studentNote: note.trim(),
        },
      });
      toast.success("Application submitted. The tutor will review it soon.");
      onDone();
      onClose();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Apply for tuition">
      <button className="absolute inset-0 bg-black/55" aria-label="Close" onClick={onClose} />
      <form onSubmit={submit} noValidate className="card relative max-h-[90vh] w-full max-w-lg overflow-y-auto p-6 sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold">Apply for this tuition</h2>
            <p className="mt-1 line-clamp-2 text-sm text-muted">{tuition.title}</p>
          </div>
          <button type="button" className="btn btn-ghost" style={{ padding: "0.4rem" }} onClick={onClose} aria-label="Close">
            <Icon name="close" size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="a-phone">Phone number</label>
            <input id="a-phone" className="input" placeholder="01XXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
            {errors.phone ? <p className="field-error">{errors.phone}</p> : null}
          </div>
          <div>
            <label className="label" htmlFor="a-sched">Preferred schedule</label>
            <input id="a-sched" className="input" placeholder="e.g. Sat, Mon, Wed after 6 PM" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
            {errors.schedule ? <p className="field-error">{errors.schedule}</p> : null}
          </div>
          <div>
            <label className="label" htmlFor="a-note">Learning note</label>
            <textarea id="a-note" rows={4} className="input" placeholder="What do you want to improve? Any topics you struggle with?" value={note} onChange={(e) => setNote(e.target.value)} />
            {errors.note ? <p className="field-error">{errors.note}</p> : null}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? <Spinner size={15} /> : null} Submit application
          </button>
        </div>
      </form>
    </div>
  );
}

function ReviewForm({ tuitionId, onDone }: { tuitionId: string; onDone: () => void }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (comment.trim().length < 5) {
      toast.error("Please write a brief review comment.");
      return;
    }
    setBusy(true);
    try {
      await api(`/tuitions/${tuitionId}/reviews`, { method: "POST", body: { rating, comment: comment.trim() } });
      toast.success("Thanks for your review!");
      setComment("");
      onDone();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-5 rounded-xl border border-border bg-surface p-4">
      <p className="mb-2 text-sm font-bold">Rate this tuition</p>
      <div className="mb-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`} className="text-accent">
            <Icon name="star" size={24} className={n <= rating ? "" : "opacity-25"} />
          </button>
        ))}
      </div>
      <textarea className="input" rows={3} placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} />
      <button className="btn btn-primary btn-sm mt-3" disabled={busy}>
        {busy ? <Spinner size={14} /> : null} Submit review
      </button>
    </form>
  );
}

export default function TuitionDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { user } = useAuth();
  const { data, loading, error, reload } = useApi<DetailResponse>(id ? `/tuitions/${id}` : null);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);

  async function toggleSave() {
    if (!id) return;
    setSaving(true);
    try {
      const res = await api<{ saved: boolean }>(`/users/saved-tuitions/${id}`, { method: "POST" });
      toast.success(res.saved ? "Saved to your bookmarks" : "Removed from bookmarks");
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container-x space-y-6 py-12" aria-busy="true">
        <Skeleton className="aspect-[16/6] w-full" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container-x py-16">
        <ErrorBox message={error || "Tuition not found."} onRetry={reload} />
        <div className="mt-6 text-center">
          <Link href="/tuitions" className="btn btn-outline">Back to Browse Tuitions</Link>
        </div>
      </div>
    );
  }

  const { tuition, relatedTuitions, viewerState } = data;
  const reviews = tuition.reviews || [];
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const details: { label: string; value: string; icon: Parameters<typeof Icon>[0]["name"] }[] = [
    { label: "Subject", value: tuition.subject, icon: "book" },
    { label: "Class level", value: tuition.classLevel, icon: "cap" },
    { label: "Mode", value: tuition.mode, icon: "globe" },
    { label: "Location", value: tuition.location, icon: "pin" },
    { label: "Schedule", value: `${tuition.daysPerWeek} days / week`, icon: "calendar" },
    { label: "Posted", value: formatDate(tuition.createdAt), icon: "clock" },
  ];

  function ApplyPanel() {
    if (!user) {
      return (
        <>
          <p className="text-sm text-muted">Sign in with a Student account to apply for this tuition.</p>
          <Link href={`/sign-in?next=${encodeURIComponent(`/tuitions/${tuition._id}`)}`} className="btn btn-primary mt-4 w-full">Sign in to apply</Link>
        </>
      );
    }
    if (user.role !== "student") {
      return (
        <>
          <button className="btn btn-primary w-full" disabled>Apply Now</button>
          <p className="mt-3 rounded-lg bg-surface p-3 text-xs leading-relaxed text-muted">
            Only students can apply for tuitions. You are signed in as a {user.role}.
          </p>
        </>
      );
    }
    if (viewerState.hasApplied) {
      return (
        <>
          <button className="btn btn-outline w-full" disabled><Icon name="check" size={16} /> Already applied</button>
          <Link href="/dashboard/student/my-applications" className="btn btn-ghost mt-2 w-full">View my applications</Link>
        </>
      );
    }
    return <button className="btn btn-primary btn-lg w-full" onClick={() => setApplying(true)}>Apply Now</button>;
  }

  return (
    <div className="container-x py-10">
      <Link href="/tuitions" className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-primary">
        <Icon name="chevronLeft" size={16} /> Back to tuitions
      </Link>

      <div className="card overflow-hidden">
        <div className="aspect-[16/6] w-full bg-surface">
          <TuitionBanner image={tuition.bannerImage} subject={tuition.subject} />
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">{tuition.subject}</span>
              <Badge value={tuition.mode === "Online" ? "info" : "pending"} label={tuition.mode} />
              {tuition.approvalStatus !== "approved" ? <Badge value={tuition.approvalStatus} /> : null}
              {!tuition.isActive ? <Badge value="closed" /> : null}
            </div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight">{tuition.title}</h1>
            {reviews.length ? (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                <Stars value={Math.round(avg)} />
                <span className="font-semibold text-foreground">{avg.toFixed(1)}</span> ({reviews.length} review{reviews.length > 1 ? "s" : ""})
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((d) => (
              <div key={d.label} className="card flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon name={d.icon} size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted">{d.label}</p>
                  <p className="truncate text-sm font-bold">{d.value}</p>
                </div>
              </div>
            ))}
          </div>

          <section>
            <h2 className="mb-3 text-xl font-extrabold">About this tuition</h2>
            <p className="whitespace-pre-line leading-relaxed text-muted">{tuition.description}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-extrabold">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-muted">No reviews yet.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div key={r._id} className="card p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold">{r.studentName}</p>
                      <Stars value={r.rating} />
                    </div>
                    <p className="mt-1.5 text-sm text-muted">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
            {viewerState.canReview ? <ReviewForm tuitionId={tuition._id} onDone={reload} /> : null}
          </section>
        </div>

        <aside className="space-y-6">
          <div className="card sticky top-24 p-6">
            <p className="text-sm text-muted">Monthly fee</p>
            <p className="text-4xl font-extrabold text-primary">{money(tuition.monthlyFee)}</p>
            <div className="mt-5">
              {ApplyPanel()}
            </div>
            {user?.role === "student" ? (
              <button className="btn btn-outline mt-3 w-full" onClick={toggleSave} disabled={saving}>
                {saving ? <Spinner size={15} /> : <Icon name="bookmark" size={16} />}
                {viewerState.isSaved ? "Remove bookmark" : "Save for later"}
              </button>
            ) : null}

            <div className="mt-6 border-t border-border pt-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">Your tutor</p>
              <div className="flex items-center gap-3">
                <Avatar src={tuition.tutorImage} name={tuition.tutorName} size={48} />
                <div className="min-w-0">
                  <p className="truncate font-bold">{tuition.tutorName}</p>
                  <div className="mt-0.5">
                    <Badge value={tuition.tutorPlan === "pro" ? "pro" : "tutor"} label={tuition.tutorPlan === "pro" ? "Verified Pro Tutor" : "Tutor"} />
                  </div>
                </div>
              </div>
              {tuition.tutorBio ? <p className="mt-3 text-sm leading-relaxed text-muted">{tuition.tutorBio}</p> : null}
            </div>
          </div>
        </aside>
      </div>

      {relatedTuitions.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-extrabold">Related tuitions</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTuitions.map((t) => (<TuitionCard key={t._id} tuition={t} />))}
          </div>
        </section>
      ) : null}

      {applying ? <ApplyModal tuition={tuition} onClose={() => setApplying(false)} onDone={reload} /> : null}
    </div>
  );
}
