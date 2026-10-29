import type { ReactNode } from "react";

export type CareStep = {
  title: ReactNode;
  /** What fits the phone card (two columns). */
  summary: ReactNode;
  /** The full text, from lg. */
  text: ReactNode;
  /** The drawing above the text: a ChatPreview, a photo, a PlanTimeline, a
   *  PhotoSequence… It fills the frame (absolute inset-0). Decorative: it
   *  repeats what the text says; only a pause button should reach the keyboard. */
  visual: ReactNode;
};

type Labels = {
  /** sr-only before the title: "Step 1: ". The number on screen is decoration. */
  step: (n: number) => string;
};
const EN: Labels = { step: (n) => `Step ${n}: ` };

type Props = {
  steps: CareStep[];
  /** The last tile, on the dark panel: the sentence and the action (a WhatsApp link, a Button). */
  invite: { text: ReactNode; action: ReactNode };
  /** Heading level of the step titles. */
  headingLevel?: "h2" | "h3";
  labels?: Partial<Labels>;
  className?: string;
};

/** The frame of each drawing: surface colour, corner concentric with the
 *  card's (28px minus the 12px of breathing room). */
const FRAME = "relative h-32 overflow-hidden rounded-2xl bg-surface md:h-52";

/**
 * How the care works, from the first contact to the treatment — creeta's
 * `Passos`, by tokens. A bento mosaic: each step has its drawing above and
 * its text below; the first takes two columns and the invite closes the
 * sequence:
 *
 *   [ 01, wide ]  02          phone:  [ 01, wide ]
 *    03   04   invite                  02   03
 *                                      04   invite
 *
 * The invite comes last: it is the conclusion of the steps.
 */
export function CareSteps({ steps, invite, headingLevel: Title = "h3", labels, className = "" }: Props) {
  const t = { ...EN, ...labels };
  return (
    <div className={`grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 ${className}`}>
      {/* contents: the <li> become tiles of the mosaic and the list stays a list */}
      <ol className="contents">
        {steps.map((s, i) => (
          <li key={i} className={`flex flex-col rounded-[28px] bg-card p-3 ${i === 0 ? "col-span-2 md:flex-row-reverse" : ""}`}>
            {i === 0 ? (
              <div className="relative overflow-hidden rounded-2xl bg-surface md:w-1/2">{s.visual}</div>
            ) : (
              <div className={FRAME}>{s.visual}</div>
            )}

            <div className="flex flex-1 flex-col px-2 pb-2 pt-4 md:px-3 md:pb-3 md:pt-5 lg:px-5 lg:pb-5 lg:pt-6">
              {/* The number is visual reinforcement; the order goes as text for the screen reader. */}
              <span aria-hidden="true" className="font-heading text-[1.75rem] font-normal leading-none tracking-[-0.04em] text-ink-soft md:text-[2.5rem]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* 16px on the phone: the column has 141px, and at 18px titles broke into three lines */}
              <Title className={`mt-2 font-heading text-base font-medium leading-snug text-ink md:text-xl ${i === 0 ? "md:mt-auto md:pt-6" : "md:mt-3"}`}>
                <span className="sr-only">{t.step(i + 1)}</span>
                {s.title}
              </Title>
              {/* the full text only when the column fits it: up to lg it has less than 180px */}
              <p className="mt-1.5 text-sm leading-relaxed text-ink-body lg:hidden">{s.summary}</p>
              <p className="mt-2 hidden leading-relaxed text-ink-body lg:block">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* The invite closes the mosaic: it is the last tile. */}
      <div className="flex min-h-[200px] flex-col justify-between gap-6 rounded-[28px] bg-surface-panel p-5 text-surface md:p-6 lg:p-8">
        <p className="font-heading text-[1.375rem] font-medium leading-[1.15] md:text-[2rem] md:leading-[1.12]">{invite.text}</p>
        <div className="self-start">{invite.action}</div>
      </div>
    </div>
  );
}
