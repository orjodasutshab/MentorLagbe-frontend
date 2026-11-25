"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-extrabold text-danger">Oops</p>
      <h1 className="mt-3 text-2xl font-extrabold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-muted">
        An unexpected error occurred while loading this page. You can try again or head back home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button className="btn btn-outline btn-lg" onClick={() => reset()}>
          Try again
        </button>
        <Link href="/" className="btn btn-primary btn-lg">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
