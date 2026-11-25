"use client";

import { useState } from "react";
import { CLASS_LEVELS, SUBJECTS } from "@/lib/format";
import type { Tuition } from "@/lib/types";
import ImageUpload from "./ImageUpload";
import { Spinner } from "./ui";

export interface TuitionFormValues {
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  description: string;
  bannerImage: string;
}

type Errors = Partial<Record<keyof TuitionFormValues, string>>;

export default function TuitionForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Tuition;
  submitLabel: string;
  onSubmit: (values: TuitionFormValues) => Promise<void>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [classLevel, setClassLevel] = useState(initial?.classLevel ?? CLASS_LEVELS[2]);
  const [mode, setMode] = useState<"Online" | "Offline">(initial?.mode ?? "Online");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [monthlyFee, setMonthlyFee] = useState(initial ? String(initial.monthlyFee) : "");
  const [daysPerWeek, setDaysPerWeek] = useState(initial ? String(initial.daysPerWeek) : "3");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [bannerImage, setBannerImage] = useState(initial?.bannerImage ?? "");
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  function validate(): TuitionFormValues | null {
    const e: Errors = {};
    if (title.trim().length < 5) e.title = "Title must be at least 5 characters.";
    if (subject.trim().length < 2) e.subject = "Subject is required.";
    if (classLevel.trim().length < 2) e.classLevel = "Class level is required.";
    if (location.trim().length < 2) e.location = "Location is required.";
    const fee = Number(monthlyFee);
    if (!Number.isFinite(fee) || fee < 500 || fee > 100000) e.monthlyFee = "Monthly fee must be between 500 and 100000.";
    const days = Number(daysPerWeek);
    if (!Number.isInteger(days) || days < 1 || days > 7) e.daysPerWeek = "Days per week must be 1 to 7.";
    if (description.trim().length < 20) e.description = "Description must be at least 20 characters.";
    if (!bannerImage.trim()) e.bannerImage = "Please upload a banner image.";
    setErrors(e);
    if (Object.keys(e).length) return null;
    return {
      title: title.trim(),
      subject: subject.trim(),
      classLevel: classLevel.trim(),
      mode,
      location: location.trim(),
      monthlyFee: fee,
      daysPerWeek: days,
      description: description.trim(),
      bannerImage: bannerImage.trim(),
    };
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const values = validate();
    if (!values) return;
    setBusy(true);
    try {
      await onSubmit(values);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-6 sm:p-8" noValidate>
      <div>
        <label className="label" htmlFor="title">Title</label>
        <input id="title" className="input" placeholder="e.g. HSC Physics Complete Batch" value={title} onChange={(e) => setTitle(e.target.value)} />
        {errors.title ? <p className="field-error">{errors.title}</p> : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="subject">Subject</label>
          <input id="subject" list="subject-list" className="input" placeholder="Pick or type a subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <datalist id="subject-list">
            {SUBJECTS.map((s) => (<option key={s} value={s} />))}
          </datalist>
          {errors.subject ? <p className="field-error">{errors.subject}</p> : null}
        </div>
        <div>
          <label className="label" htmlFor="classLevel">Class level</label>
          <select id="classLevel" className="input" value={classLevel} onChange={(e) => setClassLevel(e.target.value)}>
            {CLASS_LEVELS.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
          {errors.classLevel ? <p className="field-error">{errors.classLevel}</p> : null}
        </div>
        <div>
          <label className="label" htmlFor="mode">Mode</label>
          <select id="mode" className="input" value={mode} onChange={(e) => setMode(e.target.value as "Online" | "Offline")}>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="location">Location</label>
          <input id="location" className="input" placeholder="e.g. Dhanmondi, Dhaka or Google Meet" value={location} onChange={(e) => setLocation(e.target.value)} />
          {errors.location ? <p className="field-error">{errors.location}</p> : null}
        </div>
        <div>
          <label className="label" htmlFor="fee">Monthly fee (BDT)</label>
          <input id="fee" type="number" min={500} className="input" placeholder="e.g. 3000" value={monthlyFee} onChange={(e) => setMonthlyFee(e.target.value)} />
          {errors.monthlyFee ? <p className="field-error">{errors.monthlyFee}</p> : null}
        </div>
        <div>
          <label className="label" htmlFor="days">Days per week</label>
          <input id="days" type="number" min={1} max={7} className="input" value={daysPerWeek} onChange={(e) => setDaysPerWeek(e.target.value)} />
          {errors.daysPerWeek ? <p className="field-error">{errors.daysPerWeek}</p> : null}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="description">Description</label>
        <textarea id="description" rows={5} className="input" placeholder="What will you teach? Who is it for? Schedule, syllabus, teaching style..." value={description} onChange={(e) => setDescription(e.target.value)} />
        {errors.description ? <p className="field-error">{errors.description}</p> : null}
      </div>

      <div>
        <ImageUpload label="Banner image" value={bannerImage} onChange={setBannerImage} defaultOption="/api/assets/default-banner.svg" />
        {errors.bannerImage ? <p className="field-error">{errors.bannerImage}</p> : null}
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
          {busy ? <Spinner size={16} /> : null} {submitLabel}
        </button>
      </div>
    </form>
  );
}
