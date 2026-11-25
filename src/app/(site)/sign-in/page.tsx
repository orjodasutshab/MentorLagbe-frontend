"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/icons";
import { Spinner } from "@/components/ui";
import { useAuth } from "@/lib/auth";

const DEMO = [
  { label: "Admin", email: "admin@mentorlagbe.com", password: "Admin@1234" },
  { label: "Tutor", email: "tutor@mentorlagbe.com", password: "Tutor@1234" },
  { label: "Student", email: "student@mentorlagbe.com", password: "Student@1234" },
];

function safeNext(): string {
  if (typeof window === "undefined") return "/dashboard";
  const next = new URLSearchParams(window.location.search).get("next");
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/dashboard";
}

export default function SignInPage() {
  const router = useRouter();
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace(safeNext());
  }, [loading, user, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: { email?: string; password?: string } = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) err.email = "Enter a valid email address.";
    if (password.length < 6) err.password = "Password must be at least 6 characters.";
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    try {
      const u = await signIn(email.trim(), password);
      toast.success(`Welcome back, ${u.name.split(" ")[0]}!`);
      router.replace(safeNext());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed.");
      setBusy(false);
    }
  }

  return (
    <div className="container-x flex justify-center py-14">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-fg">
            <Icon name="cap" size={28} />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">Sign in to manage your tuitions and applications.</p>
        </div>

        <form onSubmit={submit} noValidate className="card space-y-5 p-7">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" className="input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email ? <p className="field-error">{errors.email}</p> : null}
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="current-password" className="input" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {errors.password ? <p className="field-error">{errors.password}</p> : null}
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={busy}>
            {busy ? <Spinner size={16} /> : null} Sign In
          </button>
          <p className="text-center text-sm text-muted">
            New to MentorLagbe? <Link href="/sign-up" className="font-bold text-primary">Create an account</Link>
          </p>
        </form>

        <div className="mt-6 rounded-2xl border border-dashed border-border p-4">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-muted">Quick demo login</p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO.map((d) => (
              <button key={d.label} type="button" className="btn btn-outline btn-sm" onClick={() => { setEmail(d.email); setPassword(d.password); setErrors({}); }}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
