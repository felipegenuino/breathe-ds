import type { ReactNode } from "react";

type Props = {
  /** Short month ("Nov"). */
  month: ReactNode;
  /** Day of the month. */
  day: ReactNode;
  /** 48px (default) or 56px. */
  size?: "md" | "lg";
  className?: string;
};

/** The date as a small calendar tile (Luma's "NOV / 6"): the month small on
 *  top, the day large below, on a tinted bubble. Decorative beside the written
 *  date; alone, give the parent an accessible text. */
export function DateBadge({ month, day, size = "md", className = "" }: Props) {
  const box = size === "lg" ? "h-14 w-14 rounded-2xl" : "h-12 w-12 rounded-xl";
  return (
    <span aria-hidden="true" className={`flex ${box} shrink-0 flex-col items-center justify-center bg-ink/[0.06] text-ink ${className}`}>
      <span className="text-[0.6rem] font-bold uppercase leading-none tracking-[0.12em] text-ink-soft">{month}</span>
      <span className={`mt-1 font-heading font-bold leading-none ${size === "lg" ? "text-2xl" : "text-lg"}`}>{day}</span>
    </span>
  );
}
