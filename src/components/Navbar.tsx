import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageSquare,
  Moon,
  Search,
  Sun,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SafeImage } from './ui/SafeImage';
import { CommandPalette } from './CommandPalette';
import { NotificationBell } from './NotificationBell';

export function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const dashboardPath = user ? `/dashboard/${user.role}` : '/sign-in';

  const handleSignOut = async () => {
    setMenuOpen(false);
    setMobileOpen(false);
    await signOut();
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
      isActive
        ? 'text-[#16A34A] dark:text-[#38BDF8] border-[#16A34A] dark:border-[#38BDF8]'
        : 'text-[#3A5A46] dark:text-slate-300 border-transparent hover:text-[#062012] dark:hover:text-white'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#CFE5D7] dark:border-[#213B63] bg-white/95 dark:bg-[#10203A]/95 backdrop-blur-md shadow-[0_1px_12px_-4px_rgba(6,32,18,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Wordmark */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-display text-xl font-extrabold tracking-tight text-[#062012] dark:text-white whitespace-nowrap shrink-0"
          >
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4ADE80] to-[#16A34A] dark:from-[#38BDF8] dark:to-[#2563EB] text-[#042314] dark:text-white flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4" />
            </span>
            <span>
              Mentor<span className="text-[#16A34A] dark:text-[#38BDF8]">Lagbe</span>
            </span>
          </Link>

          {/* Primary Navigation */}
          <nav className="hidden lg:flex items-center gap-5" aria-label="Main navigation">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/tutors" className={navLinkClass}>
              Find Tutors
            </NavLink>
            <NavLink to="/tuitions" className={navLinkClass}>
              Browse Tuitions
            </NavLink>
            <NavLink to="/resources" className={navLinkClass}>
              Study Resources
            </NavLink>
            <NavLink to="/quizzes" className={navLinkClass}>
              Quizzes
            </NavLink>
            <NavLink to="/pricing" className={navLinkClass}>
              Pricing
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Quick search (Ctrl+K)"
              title="Quick search (Ctrl+K)"
              className="w-9 h-9 rounded-xl border border-[#CFE5D7] dark:border-[#213B63] flex items-center justify-center text-[#3A5A46] dark:text-slate-300 hover:bg-[#EAF5EE] hover:text-[#16A34A] dark:hover:bg-[#172E52] dark:hover:text-[#38BDF8] transition-colors shrink-0"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-9 h-9 rounded-xl border border-[#CFE5D7] dark:border-[#213B63] flex items-center justify-center text-[#3A5A46] dark:text-slate-300 hover:bg-[#EAF5EE] hover:text-[#16A34A] dark:hover:bg-[#172E52] dark:hover:text-[#38BDF8] transition-colors shrink-0"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user && <NotificationBell />}

            {!user ? (
              <div className="hidden md:flex items-center gap-2.5 shrink-0">
                <Link
                  to="/sign-in"
                  className="px-3.5 py-2 text-sm font-semibold text-[#062012] dark:text-slate-200 hover:text-[#16A34A] dark:hover:text-[#38BDF8] transition-colors whitespace-nowrap shrink-0"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="px-4.5 py-2 text-sm font-bold rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] dark:from-[#2563EB] dark:to-[#0284C7] hover:brightness-105 text-white shadow-[0_4px_16px_-4px_rgba(34,197,94,0.5)] dark:shadow-[0_4px_16px_-4px_rgba(37,99,235,0.5)] transition-all whitespace-nowrap shrink-0"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl border border-[#CFE5D7] dark:border-[#213B63] bg-[#F4FAF6] dark:bg-[#172E52] hover:bg-[#EAF5EE] dark:hover:bg-[#213B63] transition-colors"
                >
                  <SafeImage
                    src={user.image}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-[#22C55E]/60 dark:ring-[#38BDF8]/60"
                  />
                  <div className="text-left leading-tight max-w-[130px]">
                    <div className="text-xs font-semibold text-[#062012] dark:text-slate-100 truncate">
                      {user.name}
                    </div>
                    <div className="text-[11px] font-semibold text-[#16A34A] dark:text-[#38BDF8] capitalize flex items-center gap-1">
                      <span>{user.role}</span>
                      {user.plan === 'pro' && (
                        <span className="px-1.5 py-0.2 rounded bg-gradient-to-r from-[#BEF264] to-[#84CC16] text-[#052E16] text-[10px] font-bold">
                          Pro
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#CFE5D7] dark:border-[#213B63] bg-white dark:bg-[#10203A] shadow-xl py-1.5 z-50">
                    <div className="px-3.5 py-2 border-b border-[#EAF5EE] dark:border-[#213B63]">
                      <p className="text-xs font-semibold text-[#062012] dark:text-slate-100 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-[#3A5A46] dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to={dashboardPath}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#062012] dark:text-slate-200 hover:bg-[#EAF5EE] dark:hover:bg-[#172E52]"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#16A34A] dark:text-[#38BDF8]" />
                      Dashboard
                    </Link>
                    <Link
                      to="/dashboard/messages"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#062012] dark:text-slate-200 hover:bg-[#EAF5EE] dark:hover:bg-[#172E52]"
                    >
                      <MessageSquare className="w-4 h-4 text-[#16A34A] dark:text-[#38BDF8]" />
                      Messages
                    </Link>
                    <Link
                      to="/dashboard/my-profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#062012] dark:text-slate-200 hover:bg-[#EAF5EE] dark:hover:bg-[#172E52]"
                    >
                      <UserIcon className="w-4 h-4 text-[#16A34A] dark:text-[#38BDF8]" />
                      My Profile &amp; Badges
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle navigation menu"
              className="lg:hidden w-9 h-9 rounded-xl border border-[#CFE5D7] dark:border-[#213B63] flex items-center justify-center text-[#062012] dark:text-slate-200"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#CFE5D7] dark:border-[#213B63] bg-white dark:bg-[#10203A] px-4 py-4 space-y-3">
            <div className="flex flex-col space-y-1">
              {[
                { label: 'Home', to: '/' },
                { label: 'Find Tutors', to: '/tutors' },
                { label: 'Browse Tuitions', to: '/tuitions' },
                { label: 'Study Resources', to: '/resources' },
                { label: 'Subject Quizzes', to: '/quizzes' },
                { label: 'Tutor Requests', to: '/tutor-requests' },
                { label: 'Pricing', to: '/pricing' },
                { label: 'About', to: '/about' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-[#062012] dark:text-slate-200 hover:bg-[#EAF5EE] dark:hover:bg-[#172E52]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-[#CFE5D7] dark:border-[#213B63]">
              {!user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/sign-in"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-2.5 text-center text-sm font-semibold rounded-xl border border-[#CFE5D7] dark:border-[#213B63] text-[#062012] dark:text-slate-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-2.5 text-center text-sm font-bold rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] dark:from-[#2563EB] dark:to-[#0284C7] text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-2 py-1">
                    <SafeImage src={user.image} alt={user.name} className="w-9 h-9 rounded-full" />
                    <div>
                      <div className="text-sm font-semibold text-[#062012] dark:text-slate-100">
                        {user.name}
                      </div>
                      <div className="text-xs font-semibold text-[#16A34A] dark:text-[#38BDF8] capitalize">
                        {user.role} · {user.plan}
                      </div>
                    </div>
                  </div>
                  <Link
                    to={dashboardPath}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-[#062012] dark:text-slate-200 hover:bg-[#EAF5EE] dark:hover:bg-[#172E52]"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/messages"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-[#062012] dark:text-slate-200 hover:bg-[#EAF5EE] dark:hover:bg-[#172E52]"
                  >
                    Messages
                  </Link>
                  <Link
                    to="/dashboard/my-profile"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-medium text-[#062012] dark:text-slate-200 hover:bg-[#EAF5EE] dark:hover:bg-[#172E52]"
                  >
                    My Profile &amp; Badges
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Top Announcement Strip */}
      {showBanner && (
        <div className="bg-[#EAF5EE] dark:bg-[#0E1E36] border-b border-[#CFE5D7] dark:border-[#213B63]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Megaphone className="w-3.5 h-3.5 text-[#16A34A] dark:text-[#38BDF8] shrink-0" />
              <p className="text-[#062012] dark:text-slate-200 truncate">
                <strong className="font-semibold">2026 Exam &amp; Admission Prep Cohorts Open:</strong>{' '}
                Verified tutors have published new Physics, Higher Math, IELTS, and ICT tracks for this term.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/tuitions"
                className="font-semibold text-[#16A34A] dark:text-[#38BDF8] hover:underline whitespace-nowrap"
              >
                Explore →
              </Link>
              <button
                type="button"
                onClick={() => setShowBanner(false)}
                aria-label="Dismiss announcement"
                className="text-slate-400 hover:text-[#062012] dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
