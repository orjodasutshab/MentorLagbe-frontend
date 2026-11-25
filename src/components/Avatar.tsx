"use client";

import { useState } from "react";
import { assetUrl } from "@/lib/api";

export default function Avatar({ src, name, size = 36 }: { src?: string; name: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const url = assetUrl(src);
  const initials = (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  if (!url || failed) {
    return (
      <span
        style={{ width: size, height: size, fontSize: size * 0.38 }}
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary-soft font-bold text-primary"
      >
        {initials || "?"}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full border border-border bg-surface object-cover"
      onError={() => setFailed(true)}
    />
  );
}
