"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/icons";
import { Spinner } from "@/components/ui";
import { useAuth } from "@/lib/auth";

type SignUpRole = "student" | "tutor";

export default function SignUpPage() {
  const router = useRouter();
  const { user, loading, signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<SignUpRole>("student");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (name.trim().length < 2) err.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) err.email = "Enter a valid email address.";
    if (password.length < 6) err.password = "Password must be at least 6 characters.";
    setErrors(err);
    if (Object.keys(err).length) return;

    setBusy(true);
    try {
      const u = await signUp({ name: name.trim(), email: email.trim(), password, role });
      toast.success(`Account created. Welcome, ${u.name.split(" ")[0]}!`);
      router.replace("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign up failed.");
      setBusy(false);
    }
  }

  const roles: { value: SignUpRole; title: string; text: string }[] = [
    { value: "student", title: "Student", text: "Find tutors and apply" },
    { value: "tutor", title: "Tutor", text: "Post tuitions and teach" },
  ];

  return (
    <div className="container-x flex justify-center py-14">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-fg">
            <Icon name="user" size={28} />
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-muted">Join MentorLagbe as a student or a tutor.</p>
        </div>

        <form onSubmit={submit} noValidate className="card space-y-5 p-7">
          <div>
            <span className="label">I am a</span>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  aria-pressed={role === r.value}
                  className="rounded-xl border p-3 text-left transition-colors"
                  style={{
                    borderColor: role === r.value ? "var(--primary)" : "var(--border)",
                    background: role === r.value ? "var(--primary-soft)" : "transparent",
                  }}
                >
                  <span className="block text-sm font-bold">{r.title}</span>
                  <span className="block text-xs text-muted">{r.text}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" autoComplete="name" className="input" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
            {errors.name ? <p className="field-error">{errors.name}</p> : null}
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" className="input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email ? <p className="field-error">{errors.email}</p> : null}
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" autoComplete="new-password" className="input" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
            {errors.password ? <p className="field-error">{errors.password}</p> : null}
          </div>
          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={busy}>
            {busy ? <Spinner size={16} /> : null} Create account
          </button>
          <p className="text-center text-sm text-muted">
            Already have an account? <Link href="/sign-in" className="font-bold text-primary">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
