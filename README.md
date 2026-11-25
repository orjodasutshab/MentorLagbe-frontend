# MentorLagbe - Smart Tuition & Mentorship Platform (Client)

MentorLagbe connects **students** with qualified **tutors** for subject-wise tuition batches and 1-on-1 mentorship.
Tutors post listings, admins moderate them, students search and apply, and both tutors and students can upgrade to a
**Pro plan** through Stripe.

- **Live site:** https://YOUR-FRONTEND.vercel.app
- **Server API:** https://mentorlagbe-bd.vercel.app
- **Server repo:** https://github.com/orjodasutshab/MentorLagbe-backend

## Test credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@mentorlagbe.com` | `Admin@1234` |
| Tutor (Pro) | `tutor@mentorlagbe.com` | `Tutor@1234` |
| Tutor (Free) | `nusrat.tutor@mentorlagbe.com` | `Tutor@1234` |
| Student (Free) | `student@mentorlagbe.com` | `Student@1234` |
| Student (Pro) | `sadia.student@mentorlagbe.com` | `Student@1234` |

The sign-in page also has one-click demo buttons.

## Key features

- **Three roles** (student, tutor, admin) with role-restricted dashboards and route guards.
- **Authentication:** email and password sign up / sign in with a role choice. A JWT is stored client side and sent as
  `Authorization: Bearer` on every protected request. The session is restored on reload, so a signed-in user is never
  bounced back to the login page.
- **Browse Tuitions:** server-side search, filters (subject, class level, mode), sorting and pagination.
- **Tuition Details:** full information, tutor summary, apply form (students only, duplicate applications blocked),
  bookmarks and star reviews for accepted students.
- **Student dashboard:** stats, my applications (cancel while pending), saved tuitions (5 free, unlimited Pro).
- **Tutor dashboard:** stats, post a tuition (free plan limited to 2), full CRUD on own tuitions, open/close toggle,
  manage applicants (accept / reject).
- **Admin dashboard:** platform stats, user and role management, tuition approval flow, Stripe transaction ledger.
- **Stripe Checkout:** Pro Tutor ($15) and Pro Student ($10) with success and cancel pages.
- **Image upload:** direct image upload (ImgBB through the API) for tuition banners and profile pictures.
- **UI:** responsive layouts, dark / light theme toggle, skeleton loaders, custom 404 and error pages, toast
  notifications, collapsible dashboard sidebar.

## Tech stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Sonner (toasts).
Backend: Node.js, Express, MongoDB, JWT, Stripe, ImgBB.

## npm packages

| Package | Purpose |
| --- | --- |
| `next`, `react`, `react-dom` | Framework and UI library |
| `tailwindcss`, `@tailwindcss/turbopack` | Styling |
| `sonner` | Toast notifications |
| `typescript`, `eslint`, `eslint-config-next`, `@types/*` | Tooling |

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit the value
npm run dev
```

### Environment variables (`.env.local`)

```
NEXT_PUBLIC_API_URL=https://mentorlagbe-bd.vercel.app/api
```

The only client variable is the API base URL. All secrets (MongoDB, JWT, Stripe, ImgBB) live in the server `.env`.

## Deployment (Vercel)

1. Push this repo to GitHub and import it in Vercel (Framework Preset: Next.js).
2. Add `NEXT_PUBLIC_API_URL` in Project Settings > Environment Variables and deploy.
3. In the **server** project set `CLIENT_URL` and `CORS_ALLOWED_ORIGINS` to the frontend URL and redeploy it.
