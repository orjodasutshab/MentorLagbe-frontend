"use client";

import RoleGuard from "@/components/RoleGuard";

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard roles={["tutor"]}>{children}</RoleGuard>;
}
