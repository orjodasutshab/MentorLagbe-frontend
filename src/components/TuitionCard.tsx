import Link from "next/link";
import { money } from "@/lib/format";
import type { Tuition } from "@/lib/types";
import Avatar from "./Avatar";
import { Icon } from "./icons";
import TuitionBanner from "./TuitionBanner";

export default function TuitionCard({ tuition }: { tuition: Tuition }) {
  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden hover:-translate-y-1">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
        <TuitionBanner image={tuition.bannerImage} subject={tuition.subject} />
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.7rem] font-bold ${tuition.mode === "Online" ? "bg-[#dbeafe] text-[#1e40af]" : "bg-[#fef3c7] text-[#92400e]"}`}>
          {tuition.mode}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-xs font-semibold">
          <span className="rounded-full bg-primary-soft px-2.5 py-1 text-primary">{tuition.subject}</span>
          <span className="truncate text-muted">{tuition.classLevel}</span>
        </div>

        <h3 className="line-clamp-2 mt-3 min-h-[3.1rem] text-base font-bold leading-snug">{tuition.title}</h3>

        <div className="mt-3 space-y-1.5 text-sm text-muted">
          <p className="flex items-center gap-2"><Icon name="pin" size={15} className="shrink-0" /> <span className="truncate">{tuition.location}</span></p>
          <p className="flex items-center gap-2"><Icon name="calendar" size={15} className="shrink-0" /> {tuition.daysPerWeek} days / week</p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar src={tuition.tutorImage} name={tuition.tutorName} size={28} />
            <span className="truncate text-sm font-semibold">{tuition.tutorName}</span>
          </div>
          <p className="shrink-0 text-right">
            <span className="text-lg font-extrabold text-primary">{money(tuition.monthlyFee)}</span>
            <span className="text-xs text-muted"> /mo</span>
          </p>
        </div>

        <Link href={`/tuitions/${tuition._id}`} className="btn btn-primary mt-4 w-full">
          View Details <Icon name="arrow" size={16} />
        </Link>
      </div>
    </article>
  );
}
