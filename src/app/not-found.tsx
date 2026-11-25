import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo />
      <p className="mt-10 text-7xl font-extrabold text-primary">404</p>
      <h1 className="mt-3 text-2xl font-extrabold">This page could not be found</h1>
      <p className="mt-2 max-w-md text-muted">
        The page you are looking for may have been moved, deleted or never existed.
      </p>
      <Link href="/" className="btn btn-primary btn-lg mt-8">
        Back to Home
      </Link>
    </div>
  );
}
