@echo off
REM Use this ONLY if you already committed the earlier version. Creates 4 commits for the new navy design.
setlocal

git add src/app/globals.css src/app/layout.tsx
git commit -m "style: switch to navy-blue theme tokens, dark default and new fonts"

git add public/images src/components/TuitionBanner.tsx src/components/TuitionCard.tsx
git commit -m "feat: show subject photos on tuition cards and compress images"

git add "src/app/(site)/page.tsx"
git commit -m "feat: redesign home hero with framed photo, wave and stats strip"

git add src/components/Navbar.tsx src/components/Logo.tsx src/components/DashboardShell.tsx
git commit -m "feat: add navbar announcement bar and gradient logo"

git status --short
echo.
echo Done. Now run: git push
endlocal
