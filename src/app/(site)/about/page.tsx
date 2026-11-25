import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";

const STUDENT_STEPS = [
  "Create a Student account",
  "Search and filter approved tuitions",
  "Apply with your phone, schedule and a short note",
  "Track the status: pending, accepted or rejected",
];

const TUTOR_STEPS = [
  "Create a Tutor account",
  "Post a tuition with a banner image",
  "Wait for admin approval (free tutors can post 2 listings)",
  "Accept or reject incoming applicants",
];

const VALUES: { icon: IconName; title: string; text: string }[] = [
  { icon: "shield", title: "Trust first", text: "Every listing is reviewed by an admin before it appears publicly." },
  { icon: "zap", title: "Fast and simple", text: "Search, apply and manage everything from clean role-based dashboards." },
  { icon: "card", title: "Secure payments", text: "Pro upgrades run on Stripe Checkout, we never touch your card details." },
];

export default function AboutPage() {
  return (
    <div className="container-x py-14">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span className="eyebrow">How it works</span>
        <h1 className="h-section">One platform for learners and mentors</h1>
        <p className="sub-section mx-auto">
          MentorLagbe connects students and parents with qualified tutors across Bangladesh, and gives tutors a structured way
          to showcase their batches and manage enrollments.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[{ title: "For students", steps: STUDENT_STEPS }, { title: "For tutors", steps: TUTOR_STEPS }].map((col) => (
          <div key={col.title} className="card p-7">
            <h2 className="text-xl font-extrabold">{col.title}</h2>
            <ol className="mt-5 space-y-4">
              {col.steps.map((s, i) => (
                <li key={s} className="flex items-start gap-3.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-fg">{i + 1}</span>
                  <span className="pt-0.5 text-sm leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title} className="card p-6">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Icon name={v.icon} size={22} />
            </span>
            <h3 className="font-bold">{v.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{v.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/sign-up" className="btn btn-primary btn-lg">Get started free</Link>
      </div>
    </div>
  );
}
