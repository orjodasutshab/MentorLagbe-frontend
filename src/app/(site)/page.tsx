"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import PricingSection from "@/components/PricingSection";
import TuitionCard from "@/components/TuitionCard";
import { ErrorBox, TuitionCardSkeleton } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useApi } from "@/lib/hooks";
import type { PlatformStats, TuitionList } from "@/lib/types";

const STEPS = [
  { step: "01", title: "Create Your Account", text: "Register in under a minute as a Student seeking mentorship or as a Tutor ready to launch a batch." },
  { step: "02", title: "Explore Available Tuitions", text: "Filter approved listings by subject, class level, monthly fee, and online or offline mode." },
  { step: "03", title: "Apply to Your Favorite Tuition", text: "Send your preferred schedule and learning goals straight to the tutor in a single form." },
  { step: "04", title: "Start Learning with Your Tutor", text: "Get your acceptance, begin structured weekly lessons, and leave a verified review." },
];

const SUBJECTS: { name: string; sub: string; icon: IconName }[] = [
  { name: "Mathematics", sub: "Calculus, Algebra & Olympiad", icon: "zap" },
  { name: "Physics", sub: "Mechanics, Optics & Circuits", icon: "globe" },
  { name: "Chemistry", sub: "Organic, Physical & Lab Prep", icon: "star" },
  { name: "Biology", sub: "Physiology, Genetics & Botany", icon: "users" },
  { name: "English", sub: "Literature & Academic Writing", icon: "book" },
  { name: "Programming", sub: "Python, TypeScript & DSA", icon: "cap" },
  { name: "IELTS", sub: "Academic Band 8.0 Coaching", icon: "globe" },
  { name: "Accounting", sub: "Financial & Cost Ledgers", icon: "dollar" },
];

const TESTIMONIALS = [
  { name: "Rafiul Islam", role: "HSC Science Candidate · Dhaka", outcome: "Higher Math mock average from 64% to 89% in 10 weeks", quote: "A tutor who built weekly timed problem sets completely changed how I approach calculus exams.", img: "/images/tutor-male.jpg" },
  { name: "Nusrat Jahan", role: "IELTS Academic Student · Chattogram", outcome: "Achieved Band 8.0 overall, 7.5 in Academic Writing", quote: "Every essay got line-by-line feedback instead of generic tips, and scheduling was effortless.", img: "/images/tutor-female.jpg" },
  { name: "Tanvir Hossain", role: "Physics & Math Tutor · Pro Plan", outcome: "Filled 6 batch seats within three weeks of approval", quote: "Seeing applicant notes and preferred schedules in one dashboard saves hours of messaging.", img: "/images/tutor-male.jpg" },
];

function Dots({ cols, rows, className }: { cols: number; rows: number; className: string }) {
  return (
    <svg className={`dots ${className}`} viewBox={`0 0 ${cols * 13 + 2} ${rows * 13 + 2}`} fill="currentColor" aria-hidden="true">
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => <circle key={`${r}-${c}`} cx={6 + c * 13} cy={6 + r * 13} r="2" />),
      )}
    </svg>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const featured = useApi<TuitionList>("/tuitions?limit=6&sort=latest");
  const stats = useApi<PlatformStats>("/tuitions/stats");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/tuitions?search=${encodeURIComponent(q)}` : "/tuitions");
  }

  const num = (n?: number) => (n === undefined ? "—" : n.toLocaleString("en-US"));

  return (
    <>
      {/* Hero */}
      <section className="hero-bg relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <Dots cols={6} rows={6} className="absolute left-2 top-4 hidden h-20 w-20 sm:block" />
          <Dots cols={7} rows={5} className="absolute bottom-20 right-4 z-10 hidden h-20 w-24 sm:block" />
          <div className="absolute -left-16 bottom-24 h-48 w-48 rounded-full bg-[#2563eb]/20 blur-2xl" />
          <div className="absolute -right-12 -top-8 hidden h-52 w-52 rounded-full bg-[#38bdf8]/15 blur-2xl lg:block" />
        </div>

        <div className="container-x relative z-10 pb-28 pt-12 sm:pb-32 sm:pt-14 lg:pb-36 lg:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="fade-up flex flex-col justify-center lg:col-span-7">
              <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-primary">
                <Icon name="checkCircle" size={14} /> Verified Online &amp; Home Tuition Marketplace
              </span>

              <h1 className="mb-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">
                Find the Best Tutor.
                <span className="mt-1 block">
                  Build a{" "}
                  <span className="relative inline-block text-primary">
                    Better Future.
                    <svg aria-hidden="true" viewBox="0 0 220 18" fill="none" preserveAspectRatio="none" className="squiggle absolute -bottom-2 left-0 h-3.5 w-full">
                      <path d="M3 10.5C58 3.5 148 2.5 217 8.5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                      <path d="M28 15C85 10.5 152 10 202 13.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity="0.7" />
                    </svg>
                  </span>
                </span>
              </h1>

              <p className="mb-8 mt-1 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                Verified 1-on-1 &amp; small-cohort mentorship built around measurable exam progress.
              </p>

              <form onSubmit={onSearch} className="mb-6 flex max-w-xl flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Icon name="search" size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    className="input"
                    style={{ height: "3rem", paddingLeft: "2.75rem", borderRadius: "1rem", background: "var(--background)" }}
                    placeholder="Search subject, class level, or location..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search tuitions"
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: "3rem", padding: "0 1.75rem", borderRadius: "1rem" }}>
                  Search Tuitions
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/tuitions" className="btn btn-primary">
                  <Icon name="search" size={16} /> Find Tutors
                </Link>
                <Link href="/tuitions" className="btn" style={{ background: "var(--surface)", color: "var(--primary)", border: "1px solid var(--border)" }}>
                  Browse Tuitions <Icon name="arrow" size={16} />
                </Link>
                <Link href={user?.role === "tutor" ? "/dashboard/tutor/post-tuition" : "/sign-up"} className="btn btn-outline">
                  Become a Tutor
                </Link>
              </div>
            </div>

            <div className="fade-up-2 relative lg:col-span-5">
              <svg aria-hidden="true" viewBox="0 0 88 56" fill="none" className="pointer-events-none absolute -right-3 -top-9 z-20 hidden h-14 w-20 rotate-12 text-primary sm:block">
                <path d="M4 22L36 8L68 20L36 33L4 22Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M17 27V39C17 42.5 25.5 46 36 46C46.5 46 55 42.5 55 39V27" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M66 21V36" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M74 14L82 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M76 22L85 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M74 30L81 34" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              <div className="photo-frame rounded-[28px] p-2.5 sm:p-3">
                <div className="aspect-[4/3] overflow-hidden rounded-[20px] bg-surface lg:aspect-[16/12]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/hero.jpg" alt="A tutor guiding a student through coursework" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layered wave */}
        <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 w-full leading-none">
          <svg viewBox="0 0 1440 130" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="h-[78px] w-full sm:h-[104px] lg:h-[124px]">
            <path d="M0 54C220 12 430 88 730 58C1030 28 1240 2 1440 36V130H0V54Z" style={{ fill: "var(--wave-back)" }} fillOpacity="0.28" />
            <path d="M0 78C250 18 520 98 840 62C1110 31 1290 22 1440 52V130H0V78Z" fill="url(#heroWave)" />
            <path d="M0 118C320 96 680 126 1060 112C1250 105 1370 108 1440 116V130H0V118Z" style={{ fill: "var(--card)" }} />
            <defs>
              <linearGradient id="heroWave" x1="0" y1="0" x2="1440" y2="120" gradientUnits="userSpaceOnUse">
                <stop style={{ stopColor: "var(--wave-a)" }} />
                <stop offset="0.55" style={{ stopColor: "var(--wave-b)" }} />
                <stop offset="1" style={{ stopColor: "var(--wave-c)" }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-border bg-card">
        <div className="container-x grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
          {[
            { v: stats.data?.totalStudents, l: "Registered Students" },
            { v: stats.data?.verifiedTutors, l: "Verified Tutors" },
            { v: stats.data?.availableTuitions, l: "Live Tuitions" },
            { v: stats.data?.successfulConnections, l: "Successful Connections" },
          ].map((s, i) => (
            <div key={s.l}>
              <div className={`font-mono text-3xl font-bold tabular-nums ${i % 2 ? "text-primary" : ""}`}>{num(s.v)}</div>
              <div className="mt-1 text-sm text-muted">{s.l}</div>
            </div>
          ))}
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
            {STEPS.map((s) => (
              <div key={s.step} className="card card-hover p-6">
                <span className="font-mono text-3xl font-bold text-primary">{s.step}</span>
                <h3 className="mt-3 text-base font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular subjects */}
      <section className="container-x py-20">
        <div className="mb-10 text-center">
          <span className="eyebrow">Popular categories</span>
          <h2 className="h-section">Top Subjects</h2>
          <p className="sub-section mx-auto">Jump straight into the subjects students search for the most.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SUBJECTS.map((s) => (
            <Link key={s.name} href={`/tuitions?subject=${encodeURIComponent(s.name)}`} className="card card-hover flex h-full items-start gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon name={s.icon} size={21} />
              </span>
              <span>
                <span className="block font-bold">{s.name}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted">{s.sub}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border bg-surface py-20">
        <div className="container-x">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="eyebrow">Success stories</span>
            <h2 className="h-section">Real Progress, Real Results</h2>
            <p className="sub-section mx-auto">Students and tutors share what changed after joining MentorLagbe.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="card flex h-full flex-col p-6">
                <p className="rounded-lg bg-primary-soft px-3 py-2 text-xs font-bold text-primary">{t.outcome}</p>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.img} alt={t.name} width={44} height={44} className="h-11 w-11 rounded-full border border-border object-cover" />
                  <span>
                    <span className="block text-sm font-bold">{t.name}</span>
                    <span className="block text-xs text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
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
      <section className="container-x pb-20">
        <div className="relative overflow-hidden rounded-3xl px-8 py-14 text-center text-white sm:px-14" style={{ background: "linear-gradient(120deg, #1d4ed8, #0284c7)" }}>
          <span className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-white/10" />
          <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to learn or teach with MentorLagbe?</h2>
          <p className="relative mx-auto mt-3 max-w-xl opacity-90">Join today and connect with the right mentor or the right students.</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/sign-up" className="btn btn-lg" style={{ background: "#fff", color: "#1d4ed8" }}>Create free account</Link>
            <Link href="/tuitions" className="btn btn-lg" style={{ border: "1px solid rgba(255,255,255,0.6)", color: "#fff" }}>Browse tuitions</Link>
          </div>
        </div>
      </section>
    </>
  );
}
