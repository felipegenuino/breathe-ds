import { Pause, Play } from "lucide-react";

type Labels = {
  /** sr-only name: "Pause {what}" / "Resume {what}". */
  pause: (what: string) => string;
  resume: (what: string) => string;
};
const EN: Labels = { pause: (what) => `Pause ${what}`, resume: (what) => `Resume ${what}` };

type Props = {
  paused: boolean;
  onToggle: () => void;
  /** What it pauses, in the page's language: "the sample conversation". */
  what: string;
  /** Colour of the circle: card (white) over the surface, surface over a card. */
  bubble?: "card" | "surface";
  /** Position (absolute) inside the drawing: "right-0 top-0". */
  className?: string;
  labels?: Partial<Labels>;
};

/** Pause/resume button of the looping drawings (creeta's `Pausa`). What moves
 *  by itself for more than 5s must be pausable (WCAG 2.2.2). 44px tap area,
 *  32px circle. */
export function PauseButton({ paused, onToggle, what, bubble = "card", className = "", labels }: Props) {
  const t = { ...EN, ...labels };
  const Icon = paused ? Play : Pause;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={paused}
      className={`absolute flex h-11 w-11 items-center justify-center rounded-full text-ink transition-transform duration-150 ease-out active:scale-[0.94] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none motion-reduce:active:scale-100 ${className}`}
    >
      <span className={`flex h-8 w-8 items-center justify-center rounded-full ${bubble === "card" ? "bg-card" : "bg-surface"}`}>
        <Icon aria-hidden="true" size={14} strokeWidth={2} className={paused ? "ml-0.5" : ""} />
      </span>
      <span className="sr-only">{paused ? t.resume(what) : t.pause(what)}</span>
    </button>
  );
}
