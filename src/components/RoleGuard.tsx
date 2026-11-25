"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/types";
import { Skeleton } from "./ui";

/**
 * Waits for the session to be restored before deciding anything, so reloading
 * a private route never bounces a signed-in user to the login page.
 */
export default function RoleGuard({ roles, children }: { roles?: Role[]; children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const allowed = Boolean(user && (!roles || roles.includes(user.role)));

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const next = typeof window !== "undefined" ? window.location.pathname : "/dashboard";
      router.replace(`/sign-in?next=${encodeURIComponent(next)}`);
      return;
    }
    if (roles && !roles.includes(user.role)) {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [loading, user, roles, router]);

  if (loading || !allowed) {
    return (
      <div className="space-y-4" aria-busy="true">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
