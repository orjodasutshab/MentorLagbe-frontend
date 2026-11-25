"use client";

import DashboardShell from "@/components/DashboardShell";
import RoleGuard from "@/components/RoleGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard>
      <DashboardShell>{children}</DashboardShell>
    </RoleGuard>
  );
}
