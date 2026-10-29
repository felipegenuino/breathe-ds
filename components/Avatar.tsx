import type { ReactNode } from "react";

type Props = {
  /** Person's name: the initials fallback and nothing else (the image is decorative). */
  name: string;
  /** Photo src. Without it, the initials in a tinted bubble (as the team cards of novo.creeta). */
  photo?: string;
  /** Your own image element (e.g. next/image), replaces `photo`. */
  children?: ReactNode;
  /** Side in px. */
  size?: number;
  /** White ring, for stacked groups. */
  ring?: boolean;
  className?: string;
};

export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2 || w === name)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

/** Round portrait, decorative (the name is written next to it). */
export function Avatar({ name, photo, children, size = 40, ring = false, className = "" }: Props) {
  const style = { width: size, height: size, fontSize: Math.round(size * 0.36) };
  const base = `inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${ring ? "ring-2 ring-white" : ""} ${className}`;
  if (children) return <span aria-hidden="true" className={base} style={style}>{children}</span>;
  if (photo) return <img src={photo} alt="" loading="lazy" decoding="async" className={`${base} object-cover`} style={style} />;
  return (
    <span aria-hidden="true" className={`${base} bg-ink/[0.12] font-heading font-bold text-ink`} style={style}>
      {initials(name)}
    </span>
  );
}
