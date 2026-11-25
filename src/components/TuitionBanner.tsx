"use client";

import { useState } from "react";
import { assetUrl, isDefaultBanner } from "@/lib/api";

const SUBJECT_IMAGES: Record<string, string> = {
  mathematics: "/images/math-physics.jpg",
  physics: "/images/math-physics.jpg",
  accounting: "/images/math-physics.jpg",
  chemistry: "/images/chemistry-bio.jpg",
  biology: "/images/chemistry-bio.jpg",
  english: "/images/english-ielts.jpg",
  ielts: "/images/english-ielts.jpg",
  programming: "/images/programming-ict.jpg",
  ict: "/images/programming-ict.jpg",
};

export function subjectImage(subject: string): string {
  return SUBJECT_IMAGES[subject.toLowerCase()] || "/images/math-physics.jpg";
}

/**
 * Shows the tutor's own banner when they uploaded one, otherwise a photo that
 * matches the subject (seed data and "Use default" banners all look different).
 */
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
  const custom = !isDefaultBanner(image) && !failed;
  const src = custom ? assetUrl(image) : subjectImage(subject);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${subject} tuition banner`}
      loading="lazy"
      className={`h-full w-full object-cover ${className}`}
      onError={() => {
        if (custom) setFailed(true);
      }}
    />
  );
}
