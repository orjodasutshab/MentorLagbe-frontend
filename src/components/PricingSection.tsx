"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Icon } from "./icons";
import { Spinner } from "./ui";

type Tab = "student" | "tutor";

const PLANS: Record<Tab, { free: string[]; pro: string[]; price: number }> = {
  student: {
    price: 10,
    free: ["Search and filter all tuitions", "Apply to tuition batches", "Track application status", "Bookmark up to 5 tuitions"],
    pro: ["Everything in Free", "Unlimited saved tuitions", "Priority booking", "Pro Student badge"],
  },
  tutor: {
    price: 15,
    free: ["Post up to 2 tuition listings", "Manage student applicants", "Banner image uploads", "Admin-verified listings"],
    pro: ["Everything in Free", "Unlimited tuition posts", "Verified Pro Tutor badge", "Higher visibility to students"],
  },
};

export default function PricingSection() {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("student");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user && (user.role === "student" || user.role === "tutor")) setTab(user.role);
  }, [user]);

  const plan = PLANS[tab];
  const alreadyPro = Boolean(user && user.role === tab && user.plan === "pro");

  async function subscribe() {
    if (!user) {
      toast.info("Please sign in to upgrade your plan.");
      router.push("/sign-in?next=/pricing");
      return;
    }
    if (user.role === "admin") {
      toast.error("Pro plans are for Student and Tutor accounts only.");
      return;
    }
    if (user.role !== tab) {
      toast.error(`This plan is for ${tab}s. Your account is a ${user.role}.`);
      return;
    }
    if (user.plan === "pro") {
      toast.info("You are already on the Pro plan.");
      return;
    }
    setBusy(true);
    try {
      const res = await api<{ checkoutUrl: string }>("/payments/create-checkout-session", { method: "POST" });
      window.location.href = res.checkoutUrl;
    } catch (err) {
      toast.error(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mx-auto mb-10 flex w-fit rounded-xl border border-border bg-card p-1">
        {(["student", "tutor"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-5 py-2 text-sm font-bold capitalize transition-colors ${
              tab === t ? "bg-primary text-primary-fg" : "text-muted hover:text-foreground"
            }`}
          >
            For {t}s
          </button>
        ))}
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        <div className="card flex flex-col p-7">
          <h3 className="text-lg font-bold">Free</h3>
          <p className="mt-1 text-sm text-muted">Everything you need to get started.</p>
          <p className="mt-5 text-4xl font-extrabold">
            $0 <span className="text-base font-medium text-muted">forever</span>
          </p>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {plan.free.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Icon name="checkCircle" size={18} className="mt-0.5 shrink-0 text-primary" /> {f}
              </li>
            ))}
          </ul>
          <button className="btn btn-outline mt-7 w-full" disabled>
            {user && user.plan === "free" && user.role === tab ? "Your current plan" : "Included"}
          </button>
        </div>

        <div className="card relative flex flex-col border-primary p-7" style={{ borderColor: "var(--primary)" }}>
          <span className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-[#2a1b00]">
            Most popular
          </span>
          <h3 className="text-lg font-bold">Pro {tab === "student" ? "Student" : "Tutor"}</h3>
          <p className="mt-1 text-sm text-muted">One-time payment. Unlock everything.</p>
          <p className="mt-5 text-4xl font-extrabold">
            ${plan.price} <span className="text-base font-medium text-muted">one-time</span>
          </p>
          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {plan.pro.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Icon name="checkCircle" size={18} className="mt-0.5 shrink-0 text-primary" /> {f}
              </li>
            ))}
          </ul>
          <button className="btn btn-primary mt-7 w-full" onClick={subscribe} disabled={busy || alreadyPro}>
            {busy ? <Spinner size={16} /> : <Icon name="card" size={17} />}
            {alreadyPro ? "You are on Pro" : "Subscribe with Stripe"}
          </button>
        </div>
      </div>
    </div>
  );
}
