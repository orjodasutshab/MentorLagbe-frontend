"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import Avatar from "./Avatar";
import { Icon } from "./icons";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { Badge, Skeleton } from "./ui";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Browse Tuitions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "How It Works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [announce, setAnnounce] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out successfully");
    router.push("/");
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 shadow-[0_1px_12px_-4px_rgba(0,0,0,0.25)] backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                isActive(l.href) ? "bg-primary-soft text-primary" : "text-muted hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <Link
              href="/dashboard"
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                pathname.startsWith("/dashboard") ? "bg-primary-soft text-primary" : "text-muted hover:text-foreground"
              }`}
            >
              Dashboard
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {loading ? (
            <Skeleton className="hidden h-9 w-28 sm:block" />
          ) : user ? (
            <div className="relative hidden lg:block" ref={menuRef}>
              <button
                onClick={() => setMenu((v) => !v)}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-card py-1.5 pl-1.5 pr-3 transition-colors hover:border-primary"
                aria-haspopup="menu"
                aria-expanded={menu}
              >
                <Avatar src={user.image} name={user.name} size={32} />
                <span className="text-left leading-tight">
                  <span className="block max-w-[8rem] truncate text-sm font-bold">{user.name}</span>
                  <span className="block text-[0.7rem] font-semibold capitalize text-primary">{user.role}</span>
                </span>
                <Icon name="chevron" size={16} className="text-muted" />
              </button>
              {menu ? (
                <div className="card absolute right-0 mt-2 w-60 p-2" role="menu">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <Badge value={user.role} />
                    <Badge value={user.plan} label={user.plan === "pro" ? "Pro" : "Free plan"} />
                  </div>
                  <p className="truncate px-3 pb-2 text-xs text-muted">{user.email}</p>
                  <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-surface" role="menuitem">
                    <Icon name="grid" size={16} /> Dashboard
                  </Link>
                  <Link href="/dashboard/profile" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-surface" role="menuitem">
                    <Icon name="user" size={16} /> Update Profile
                  </Link>
                  <button onClick={handleSignOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-danger hover:bg-surface" role="menuitem">
                    <Icon name="logout" size={16} /> Sign Out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/sign-in" className="btn btn-outline btn-sm">Sign In</Link>
              <Link href="/sign-up" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          <button className="btn btn-ghost lg:hidden" style={{ padding: "0.5rem" }} onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open}>
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container-x flex flex-col gap-1 py-3">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={`rounded-lg px-3 py-2.5 text-sm font-semibold ${isActive(l.href) ? "bg-primary-soft text-primary" : "text-foreground"}`}>
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="my-2 flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                  <Avatar src={user.image} name={user.name} size={40} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{user.name}</p>
                    <div className="mt-0.5 flex gap-1.5">
                      <Badge value={user.role} />
                      <Badge value={user.plan} label={user.plan === "pro" ? "Pro" : "Free"} />
                    </div>
                  </div>
                </div>
                <Link href="/dashboard" className="rounded-lg px-3 py-2.5 text-sm font-semibold">Dashboard</Link>
                <Link href="/dashboard/profile" className="rounded-lg px-3 py-2.5 text-sm font-semibold">Update Profile</Link>
                <button onClick={handleSignOut} className="rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-danger">Sign Out</button>
              </>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/sign-in" className="btn btn-outline">Sign In</Link>
                <Link href="/sign-up" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>

    {announce ? (
      <div className="border-b border-border bg-surface">
        <div className="container-x flex items-center justify-between gap-3 py-2 text-xs sm:text-sm">
          <p className="flex min-w-0 items-center gap-2 text-muted">
            <Icon name="zap" size={15} className="shrink-0 text-primary" />
            <span className="truncate">
              <span className="font-bold text-foreground">2026 Exam &amp; Admission Prep Cohorts Open:</span>{" "}
              <span className="hidden sm:inline">Verified tutors have published new Physics, Higher Math, IELTS, and ICT tracks for this term.</span>
            </span>
          </p>
          <div className="flex shrink-0 items-center gap-3">
            <Link href="/tuitions" className="font-bold text-primary hover:underline">Explore →</Link>
            <button onClick={() => setAnnounce(false)} aria-label="Dismiss announcement" className="text-muted hover:text-foreground">
              <Icon name="close" size={16} />
            </button>
          </div>
        </div>
      </div>
    ) : null}
    </>
  );
}
