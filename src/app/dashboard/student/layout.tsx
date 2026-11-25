"use client";

import RoleGuard from "@/components/RoleGuard";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard roles={["student"]}>{children}</RoleGuard>;
}
