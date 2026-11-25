"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import PricingSection from "@/components/PricingSection";
import TuitionCard from "@/components/TuitionCard";
import { ErrorBox, TuitionCardSkeleton } from "@/components/ui";
import { useApi } from "@/lib/hooks";
import type { PlatformStats, TuitionList } from "@/lib/types";

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: "user", title: "Create your account", text: "Sign up as a Student or a Tutor in under a minute. Your profile and plan are set up automatically." },
  { icon: "search", title: "Search or post", text: "Students filter approved tuitions by subject, class and mode. Tutors post batches with a banner image." },
  { icon: "shield", title: "Verified by admins", text: "Every new listing is reviewed by our admins, so only trusted tuitions reach the public page." },
  { icon: "checkCircle", title: "Apply and connect", text: "Students apply in one form, tutors accept or reject, and both track progress in real time." },
];

const SUBJECTS: { name: string; icon: IconName; tone: string }[] = [
  { name: "Mathematics", icon: "zap", tone: "#0f766e" },
  { name: "Physics", icon: "globe", tone: "#4338ca" },
  { name: "Programming", icon: "cap", tone: "#6d28d9" },
  { name: "IELTS", icon: "book", tone: "#0369a1" },
  { name: "Chemistry", icon: "star", tone: "#a21caf" },
  { name: "English", icon: "users", tone: "#c2410c" },
];

const TESTIMONIALS = [
  { name: "Tahmina Akter", role: "HSC Student, Dhaka", text: "I found a Physics tutor within two days. The filters made it easy to compare fees and schedules, and the tutor accepted my application the same evening." },
  { name: "Rakib Hasan", role: "Math Tutor", text: "Posting my batch was simple and the admin approval gave students confidence. I now teach three batches every week without chasing anyone." },
  { name: "Nusrat Jahan", role: "IELTS Learner", text: "Tracking every application in one dashboard saved me so much stress. Upgrading to Pro to bookmark more tutors was totally worth it." },
];

function Counter({ value, label, icon }: { value?: number; label: string; icon: IconName }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon name={icon} size={22} />
      </span>
      <div>
        <p className="text-2xl font-extrabold leading-tight">{value === undefined ? "--" : `${value.toLocaleString("en-US")}+`}</p>
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const featured = useApi<TuitionList>("/tuitions?limit=6&sort=latest");
  const stats = useApi<PlatformStats>("/tuitions/stats");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/tuitions?search=${encodeURIComponent(q)}` : "/tuitions");
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-soft blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-primary-soft opacity-70 blur-3xl" />
        <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="eyebrow fade-up">Smart Tuition &amp; Mentorship</span>
            <h1 className="fade-up-2 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Find Your Ideal Tutor or Mentorship Batch <span className="text-primary">Today</span>
            </h1>
            <p className="fade-up-3 mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Search admin-verified tuitions by subject, class level and monthly budget. Apply in one form and track every
              application in real time.
            </p>

            <form onSubmit={onSearch} className="fade-up-3 mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  className="input"
                  style={{ paddingLeft: "2.75rem", paddingTop: "0.85rem", paddingBottom: "0.85rem" }}
                  placeholder="Search subject, e.g. Physics"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search tuitions"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg">
                Browse Tuitions
              </button>
            </form>

            <div className="fade-up-3 mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
              <span className="flex items-center gap-2"><Icon name="checkCircle" size={17} className="text-primary" /> Admin-verified listings</span>
              <span className="flex items-center gap-2"><Icon name="checkCircle" size={17} className="text-primary" /> Online &amp; offline tuition</span>
              <span className="flex items-center gap-2"><Icon name="checkCircle" size={17} className="text-primary" /> Secure Stripe payments</span>
            </div>
          </div>

          {/* Hero art */}
          <div className="relative mx-auto hidden h-[26rem] w-full max-w-md lg:block" aria-hidden="true">
            <div className="float card absolute left-0 top-4 w-72 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-fg"><Icon name="book" size={22} /></span>
                <div>
                  <p className="text-sm font-bold">HSC Physics Batch</p>
                  <p className="text-xs text-muted">Class 11-12 · Online</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-extrabold text-primary">৳3,000 /mo</span>
                <span className="badge badge-success">Approved</span>
              </div>
            </div>
            <div className="float card absolute right-0 top-32 w-64 p-5" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (<Icon key={i} name="star" size={16} />))}
              </div>
              <p className="mt-2 text-sm font-semibold">&ldquo;Best decision for my IELTS prep.&rdquo;</p>
              <p className="mt-1 text-xs text-muted">Nusrat · IELTS Learner</p>
            </div>
            <div className="float card absolute bottom-2 left-10 flex w-60 items-center gap-3 p-4" style={{ animationDelay: "2s" }}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-[#2a1b00]"><Icon name="checkCircle" size={20} /></span>
              <div>
                <p className="text-sm font-bold">Application accepted</p>
                <p className="text-xs text-muted">Math · Class 9-10</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured tuitions */}
      <section className="container-x py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Latest listings</span>
            <h2 className="h-section">Featured Tuitions</h2>
            <p className="sub-section">Freshly approved batches and one-to-one mentorship from our tutors.</p>
          </div>
          <Link href="/tuitions" className="btn btn-outline">
            View all tuitions <Icon name="arrow" size={16} />
          </Link>
        </div>

        {featured.error ? (
          <ErrorBox message={featured.error} onRetry={featured.reload} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.loading
              ? Array.from({ length: 6 }).map((_, i) => <TuitionCardSkeleton key={i} />)
              : featured.data?.items.map((t) => <TuitionCard key={t._id} tuition={t} />)}
          </div>
        )}
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-border bg-surface py-20">
        <div className="container-x">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="eyebrow">Simple workflow</span>
            <h2 className="h-section">How MentorLagbe Works</h2>
            <p className="sub-section mx-auto">From sign-up to your first class in four easy steps.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="card relative p-6">
                <span className="absolute right-5 top-4 text-4xl font-extrabold text-primary-soft">{i + 1}</span>
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-fg">
                  <Icon name={s.icon} size={22} />
                </span>
                <h3 className="text-base font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects + stats + testimonials */}
      <section className="container-x py-20">
        <div className="mb-10 text-center">
          <span className="eyebrow">Popular categories</span>
          <h2 className="h-section">Top Subjects</h2>
          <p className="sub-section mx-auto">Jump straight into the subjects students search for the most.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SUBJECTS.map((s) => (
            <Link
              key={s.name}
              href={`/tuitions?subject=${encodeURIComponent(s.name)}`}
              className="card flex flex-col items-center gap-3 p-5 text-center transition-transform hover:-translate-y-1"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: s.tone }}>
                <Icon name={s.icon} size={22} />
              </span>
              <span className="text-sm font-bold">{s.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Counter value={stats.data?.totalStudents} label="Students joined" icon="users" />
          <Counter value={stats.data?.verifiedTutors} label="Verified tutors" icon="shield" />
          <Counter value={stats.data?.availableTuitions} label="Live tuitions" icon="book" />
          <Counter value={stats.data?.successfulConnections} label="Successful connections" icon="checkCircle" />
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card flex h-full flex-col p-6">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (<Icon key={i} name="star" size={16} />))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted">&ldquo;{t.text}&rdquo;</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                  {t.name.split(" ").map((p) => p[0]).join("")}
                </span>
                <span>
                  <span className="block text-sm font-bold">{t.name}</span>
                  <span className="block text-xs text-muted">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border bg-surface py-20">
        <div className="container-x">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="eyebrow">Plans</span>
            <h2 className="h-section">Free or Pro, Your Choice</h2>
            <p className="sub-section mx-auto">Start free. Upgrade once with Stripe when you need more.</p>
          </div>
          <PricingSection />
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-20">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center text-primary-fg sm:px-14">
          <span className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-white/10" />
          <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to learn or teach with MentorLagbe?</h2>
          <p className="relative mx-auto mt-3 max-w-xl opacity-90">Join today and connect with the right mentor or the right students.</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/sign-up" className="btn btn-lg" style={{ background: "#fff", color: "#0f766e" }}>Create free account</Link>
            <Link href="/tuitions" className="btn btn-lg" style={{ border: "1px solid rgba(255,255,255,0.6)", color: "inherit" }}>Browse tuitions</Link>
          </div>
        </div>
      </section>
    </>
  );
}
