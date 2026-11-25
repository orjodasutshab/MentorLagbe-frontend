@echo off
REM Creates a clean, feature-by-feature commit history. Run once from the project root, then: git push
REM Delete this file afterwards (do not commit it).
setlocal

git add package.json next.config.ts eslint.config.mjs tsconfig.json .gitignore .env.example AGENTS.md
git commit -m "chore: configure Next.js, Tailwind CSS and ESLint"

git add src/app/globals.css src/app/favicon.ico
git commit -m "style: add design tokens, dark theme and shared button/card styles"

git add src/lib/types.ts src/lib/format.ts
git commit -m "feat: add shared domain types and formatting helpers"

git add src/lib/api.ts
git commit -m "feat: add API client with bearer token handling"

git add src/lib/auth.tsx
git commit -m "feat: add auth context that restores the session on reload"

git add src/lib/hooks.ts
git commit -m "feat: add useApi data fetching hook"

git add src/components/icons.tsx
git commit -m "feat: add inline SVG icon set including the new X logo"

git add src/components/ui.tsx src/components/Logo.tsx src/components/Avatar.tsx
git commit -m "feat: add UI primitives (badges, skeletons, stat cards, pagination)"

git add src/components/ThemeToggle.tsx src/app/layout.tsx
git commit -m "feat: add root layout with theme toggle, auth provider and toasts"

git add src/components/Navbar.tsx src/components/Footer.tsx "src/app/(site)/layout.tsx"
git commit -m "feat: add responsive navbar and footer"

git add src/components/TuitionBanner.tsx src/components/TuitionCard.tsx public/images
git commit -m "feat: add equal-height tuition card with subject banners"

git add src/components/PricingSection.tsx
git commit -m "feat: add Free vs Pro pricing with Stripe checkout"

git add "src/app/(site)/page.tsx"
git commit -m "feat: build home page with hero, featured tuitions and extra sections"

git add "src/app/(site)/tuitions/page.tsx"
git commit -m "feat: browse tuitions with server-side search, filters and pagination"

git add "src/app/(site)/tuitions"
git commit -m "feat: tuition details page with apply form, bookmarks and reviews"

git add "src/app/(site)/sign-in" "src/app/(site)/sign-up"
git commit -m "feat: add role-based sign up and sign in with validation"

git add "src/app/(site)/payment" "src/app/(site)/pricing" "src/app/(site)/about"
git commit -m "feat: add payment status, pricing and how-it-works pages"

git add src/app/loading.tsx src/app/not-found.tsx src/app/error.tsx "src/app/(site)/loading.tsx" src/app/dashboard/loading.tsx
git commit -m "feat: add loading skeletons, custom 404 and error pages"

git add src/components/RoleGuard.tsx src/components/DashboardShell.tsx src/app/dashboard/layout.tsx src/app/dashboard/page.tsx
git commit -m "feat: add collapsible dashboard shell with role guard"

git add src/components/ImageUpload.tsx src/components/TuitionForm.tsx src/app/dashboard/profile
git commit -m "feat: add image upload, tuition form and update profile page"

git add src/app/dashboard/student
git commit -m "feat: student dashboard with applications and saved tuitions"

git add src/app/dashboard/tutor
git commit -m "feat: tutor dashboard with tuition CRUD and applicant management"

git add src/app/dashboard/admin
git commit -m "feat: admin dashboard with users, approvals and transactions"

git add README.md
git commit -m "docs: add README with credentials, features and packages"

git status --short
echo.
echo Done. Now run: git push
endlocal
