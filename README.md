# MentorLagbe — Frontend Client

Smart Tuition & Mentorship Marketplace web application connecting Students, Tutors, and Admins.

- **Project Name:** MentorLagbe
- **Purpose:** Enable Students to search, filter, bookmark, apply for, and review verified online and home tuitions; empower Tutors to publish tuition listings, upload banners via ImgBB, and manage student applicants; give Admins moderation, role governance, and Stripe revenue visibility.
- **Live URL:** Configure your deployed client URL here (e.g. `https://mentorlagbe.vercel.app`)

## Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@mentorlagbe.com` | `Admin@1234` |
| **Tutor (Free)** | `tutor@mentorlagbe.com` | `Tutor@1234` |
| **Student (Free)** | `student@mentorlagbe.com` | `Student@1234` |

## Key Features

- **Public Marketplace:** Hero search, platform stats strip, featured approved listings, server-side filtered & paginated `/tuitions` directory (Subject, Class Level, Mode, Max Monthly Fee, Sort).
- **Role-Based Dashboards:**
  - **Student:** Overview metrics, Application status tracking (`pending` / `accepted` / `rejected`) with pending cancellation, Bookmarked Tuitions (Free cap of 5, Pro unlimited), Verified Student Reviews after acceptance, Pro Student upgrade ($10 via Stripe).
  - **Tutor:** Overview with Free 2-tuition quota tracker, Post Tuition form with ImgBB file upload (`react-hook-form` + `zod`), My Tuitions (edit, pause/activate, delete), Applicant Management (accept/reject student applications), Pro Tutor upgrade ($15 via Stripe).
  - **Admin:** Platform analytics, User management (search, role updates, user removal), Tuition moderation (Approve / Reject with reason / Toggle active), Stripe Transactions ledger.
- **Reload Persistence & Theme:** `HttpOnly` cookie session restoration prevents unwanted redirects to Sign In on route reload; includes persistent Dark/Light theme toggle.

## Key NPM Packages Used

- `react`, `react-dom`, `react-router-dom`
- `react-hook-form`, `@hookform/resolvers`, `zod`
- `tailwindcss`, `@tailwindcss/vite`, `clsx`, `tailwind-merge`
- `lucide-react`, `motion`, `sonner`

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```
