"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import type { Role } from "@/lib/types";
import Avatar from "./Avatar";
import { Icon, type IconName } from "./icons";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { Badge } from "./ui";

interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  exact?: boolean;
}

const NAV: Record<Role, NavItem[]> = {
  student: [
    { href: "/dashboard/student", label: "Overview", icon: "grid", exact: true },
    { href: "/dashboard/student/my-applications", label: "My Applications", icon: "file" },
    { href: "/dashboard/student/saved", label: "Saved Tuitions", icon: "bookmark" },
    { href: "/dashboard/profile", label: "Update Profile", icon: "user" },
  ],
  tutor: [
    { href: "/dashboard/tutor", label: "Overview", icon: "grid", exact: true },
    { href: "/dashboard/tutor/post-tuition", label: "Post a Tuition", icon: "plus" },
    { href: "/dashboard/tutor/my-tuitions", label: "My Tuitions", icon: "book" },
    { href: "/dashboard/tutor/applicants", label: "Applicants", icon: "users" },
    { href: "/dashboard/profile", label: "Update Profile", icon: "user" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: "grid", exact: true },
    { href: "/dashboard/admin/users", label: "Users", icon: "users" },
    { href: "/dashboard/admin/tuitions", label: "Tuition Approval", icon: "shield" },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: "dollar" },
    { href: "/dashboard/profile", label: "Update Profile", icon: "user" },
  ],
};

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const items = user ? NAV[user.role] : [];
  const active = (item: NavItem) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out successfully");
    router.push("/");
  }

  const sidebar = (compact: boolean) => (
    <div className="flex h-full flex-col">
      <div className={`flex h-16 items-center border-b border-border ${compact ? "justify-center" : "px-5"}`}>
        {compact ? (
          <Link href="/" aria-label="Home" className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: "linear-gradient(135deg, var(--grad-a), var(--grad-b))" }}>
            <Icon name="cap" size={20} />
          </Link>
        ) : (
          <Logo />
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Dashboard">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${compact ? "justify-center" : ""} ${
              active(item) ? "bg-primary-soft text-primary" : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            <Icon name={item.icon} size={19} />
            {compact ? null : item.label}
          </Link>
        ))}
        {user && user.role !== "admin" ? (
          <Link
            href="/pricing"
            title="Upgrade plan"
            className={`mt-3 flex items-center gap-3 rounded-xl border border-dashed border-border px-3 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-primary hover:text-primary ${compact ? "justify-center" : ""}`}
          >
            <Icon name="zap" size={19} />
            {compact ? null : user.plan === "pro" ? "Pro plan active" : "Upgrade to Pro"}
          </Link>
        ) : null}
      </nav>

      <div className="space-y-1 border-t border-border p-3">
        <Link href="/" title="Back to site" className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted hover:bg-surface hover:text-foreground ${compact ? "justify-center" : ""}`}>
          <Icon name="home" size={19} />
          {compact ? null : "Back to site"}
        </Link>
        <button onClick={handleSignOut} title="Sign out" className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-danger hover:bg-surface ${compact ? "justify-center" : ""}`}>
          <Icon name="logout" size={19} />
          {compact ? null : "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`sticky top-0 hidden h-screen shrink-0 border-r border-border bg-card transition-[width] duration-200 lg:block ${
          collapsed ? "w-[4.75rem]" : "w-64"
        }`}
      >
        {sidebar(collapsed)}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/50" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-border bg-card shadow-xl">{sidebar(false)}</aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost lg:hidden" style={{ padding: "0.5rem" }} onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Icon name="menu" size={22} />
            </button>
            <button className="btn btn-ghost hidden lg:inline-flex" style={{ padding: "0.5rem" }} onClick={() => setCollapsed((v) => !v)} aria-label="Collapse sidebar">
              <Icon name="sidebar" size={20} />
            </button>
            <span className="hidden text-sm font-semibold text-muted sm:block">
              {user ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)} dashboard` : "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card py-1.5 pl-1.5 pr-3">
                <Avatar src={user.image} name={user.name} size={32} />
                <div className="hidden leading-tight sm:block">
                  <p className="max-w-[9rem] truncate text-sm font-bold">{user.name}</p>
                  <div className="mt-0.5 flex gap-1">
                    <Badge value={user.role} />
                    <Badge value={user.plan} label={user.plan === "pro" ? "Pro" : "Free"} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </header>

        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
