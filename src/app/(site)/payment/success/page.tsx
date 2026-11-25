"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Skeleton } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDate, money } from "@/lib/format";
import type { Payment, User } from "@/lib/types";

interface VerifyResponse {
  verified: boolean;
  payment?: Payment;
  user?: User | null;
}

export default function PaymentSuccessPage() {
  const { user, loading: authLoading, setUser } = useAuth();
  const [state, setState] = useState<"verifying" | "done" | "error">("verifying");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [message, setMessage] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (authLoading || started.current) return;
    if (!user) {
      setState("error");
      setMessage("Please sign in to verify your payment.");
      return;
    }
    started.current = true;
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (!sessionId) {
      setState("error");
      setMessage("No payment session was found in this link.");
      return;
    }
    api<VerifyResponse>("/payments/verify-session", { method: "POST", body: { sessionId } })
      .then((res) => {
        if (res.payment) setPayment(res.payment);
        if (res.user) setUser(res.user);
        setState("done");
      })
      .catch((err) => {
        setState("error");
        setMessage(errorMessage(err));
      });
  }, [authLoading, user, setUser]);

  return (
    <div className="container-x flex justify-center py-16">
      <div className="card w-full max-w-lg p-8 text-center">
        {state === "verifying" ? (
          <div className="space-y-4" aria-busy="true">
            <Skeleton className="mx-auto h-16 w-16 rounded-full" />
            <Skeleton className="mx-auto h-6 w-2/3" />
            <Skeleton className="mx-auto h-4 w-full" />
            <p className="text-sm text-muted">Verifying your payment...</p>
          </div>
        ) : state === "done" ? (
          <>
            <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#d1fae5] text-[#047857]">
              <Icon name="checkCircle" size={34} />
            </span>
            <h1 className="text-2xl font-extrabold">Payment successful</h1>
            <p className="mt-2 text-sm text-muted">Your account is now on the Pro plan. Enjoy the extra features!</p>
            {payment ? (
              <dl className="mt-6 space-y-2.5 rounded-xl bg-surface p-4 text-left text-sm">
                <div className="flex justify-between gap-4"><dt className="text-muted">Plan</dt><dd className="font-bold">{payment.planName}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted">Amount</dt><dd className="font-bold">{money(payment.amount, payment.currency)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted">Date</dt><dd className="font-bold">{formatDate(payment.paidAt)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-muted">Transaction</dt><dd className="max-w-[12rem] truncate font-mono text-xs font-bold">{payment.transactionId}</dd></div>
              </dl>
            ) : null}
            <Link href="/dashboard" className="btn btn-primary btn-lg mt-7 w-full">Go to Dashboard</Link>
          </>
        ) : (
          <>
            <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#fee2e2] text-[#b91c1c]">
              <Icon name="alert" size={30} />
            </span>
            <h1 className="text-2xl font-extrabold">We could not verify the payment</h1>
            <p className="mt-2 text-sm text-muted">{message}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/pricing" className="btn btn-outline">Back to pricing</Link>
              <Link href="/dashboard" className="btn btn-primary">Dashboard</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
