import Link from "next/link";
import { FacebookLogo, Icon, LinkedinLogo, XLogo } from "./icons";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Bangladesh&apos;s smart tuition and mentorship platform. Find verified tutors by subject, class level and budget, or
            grow your teaching practice.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-primary hover:text-primary">
              <XLogo size={16} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-primary hover:text-primary">
              <FacebookLogo size={16} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-primary hover:text-primary">
              <LinkedinLogo size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">Explore</h4>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><Link className="hover:text-primary" href="/">Home</Link></li>
            <li><Link className="hover:text-primary" href="/tuitions">Browse Tuitions</Link></li>
            <li><Link className="hover:text-primary" href="/pricing">Pricing</Link></li>
            <li><Link className="hover:text-primary" href="/about">How It Works</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">Account</h4>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><Link className="hover:text-primary" href="/sign-in">Sign In</Link></li>
            <li><Link className="hover:text-primary" href="/sign-up">Create an account</Link></li>
            <li><Link className="hover:text-primary" href="/dashboard">Dashboard</Link></li>
            <li><Link className="hover:text-primary" href="/dashboard/profile">Update Profile</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex items-start gap-2.5"><Icon name="mail" size={16} className="mt-0.5 text-primary" /> support@mentorlagbe.com</li>
            <li className="flex items-start gap-2.5"><Icon name="phone" size={16} className="mt-0.5 text-primary" /> +880 1700 000 000</li>
            <li className="flex items-start gap-2.5"><Icon name="pin" size={16} className="mt-0.5 text-primary" /> Dhanmondi, Dhaka 1209, Bangladesh</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} MentorLagbe. All rights reserved.</p>
          <p>Smart Tuition &amp; Mentorship Platform</p>
        </div>
      </div>
    </footer>
  );
}
