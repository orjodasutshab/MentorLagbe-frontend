import Link from "next/link";
import { Icon } from "./icons";

export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5" aria-label="MentorLagbe home">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ background: "linear-gradient(135deg, var(--grad-a), var(--grad-b))" }}>
        <Icon name="cap" size={20} />
      </span>
      <span className="text-xl font-extrabold tracking-tight">
        Mentor<span className="text-primary">Lagbe</span>
      </span>
    </Link>
  );
}
