"use client";

import { useState } from "react";
import { assetUrl, isDefaultBanner } from "@/lib/api";
import { Icon } from "./icons";

const GRADIENTS: Record<string, [string, string]> = {
  mathematics: ["#0f766e", "#14b8a6"],
  physics: ["#3730a3", "#6366f1"],
  chemistry: ["#86198f", "#d946ef"],
  biology: ["#166534", "#4ade80"],
  english: ["#c2410c", "#fb923c"],
  ielts: ["#075985", "#38bdf8"],
  ict: ["#334155", "#64748b"],
  programming: ["#5b21b6", "#8b5cf6"],
  accounting: ["#b45309", "#fbbf24"],
};

export default function TuitionBanner({
  image,
  subject,
  className = "",
}: {
  image?: string;
  subject: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = !isDefaultBanner(image) && !failed;
  const [from, to] = GRADIENTS[subject.toLowerCase()] || ["#0f766e", "#2dd4bf"];

  if (showImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={assetUrl(image)}
        alt={`${subject} tuition banner`}
        className={`h-full w-full object-cover ${className}`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <span className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/15" />
      <span className="absolute -bottom-8 -left-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="relative flex flex-col items-center gap-2 text-white">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
          <Icon name="book" size={24} />
        </span>
        <span className="text-sm font-bold tracking-wide">{subject}</span>
      </div>
    </div>
  );
}
