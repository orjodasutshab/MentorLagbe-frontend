export function money(n: number, currency = "BDT"): string {
  if (currency.toUpperCase() === "USD") return `$${n.toFixed(2)}`;
  return `৳${Number(n).toLocaleString("en-US")}`;
}

export function formatDate(iso?: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "IELTS",
  "ICT",
  "Programming",
  "Accounting",
];

export const CLASS_LEVELS = [
  "Class 6-8",
  "Class 9-10",
  "Class 11-12",
  "IELTS / Admission",
  "University / Skill Track",
];
