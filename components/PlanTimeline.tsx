"use client";

import { useState } from "react";
import { useOnAppear } from "./useOnAppear";
import { PauseButton } from "./PauseButton";

type Labels = {
  /** Completes the pause button's name: "Pause the plan animation". */
  pause: string;
};
const EN: Labels = { pause: "the plan animation" };

type Props = {
  /** The three stages, short ("Short", "Medium", "Long"). Three: the keyframes
   *  in theme.css light one dot at a time, and there are three sets. */
  names: [string, string, string];
  /** Only from md, glued to the name: " term" → "Short term". */
  suffix?: string;
  labels?: Partial<Labels>;
  className?: string;
};

/**
 * Step 3 of the care flow (creeta's `Prazos`): the three stages of the plan.
 * The line comes down and each dot lights up when it reaches it; after a rest
 * everything goes off and restarts (6s loop, keyframes in theme.css).
 * - Starts when on screen and only runs while on screen.
 * - Moves by itself for more than 5s: pause button (WCAG 2.2.2).
 * - Without JavaScript or with reduced motion: still, the three dots lit, no button.
 * Fills its box (absolute inset-0): put it in a frame with a height.
 */
export function PlanTimeline({ names, suffix, labels, className = "" }: Props) {
  const t = { ...EN, ...labels };
  const { ref, state, onScreen } = useOnAppear<HTMLDivElement>();
  const [paused, setPaused] = useState(false);

  return (
    <div ref={ref} data-state={state} data-stopped={paused || !onScreen ? "" : undefined} className={`cg-plan absolute inset-0 ${className}`}>
      <div aria-hidden="true" className="absolute inset-y-3 left-3 right-0 flex flex-col justify-center rounded-l-2xl bg-card pl-3 md:inset-y-5 md:left-5 md:pl-5">
        {/* the track, light, and over it the line that comes down */}
        <span className="absolute bottom-[22%] left-[17.5px] top-[22%] w-px bg-ink-soft/25 md:left-[25.5px]" />
        <span className="cg-plan-line absolute bottom-[22%] left-[17.5px] top-[22%] w-px origin-top bg-ink-soft md:left-[25.5px]" />
        {names.map((name, i) => (
          <span
            key={name}
            data-n={i + 1}
            className={`cg-plan-step flex flex-1 items-center gap-2.5 text-[0.8125rem] font-medium text-ink md:gap-3.5 md:text-[0.9375rem] ${i > 0 ? "border-t border-ink/10" : ""}`}
          >
            <span className="relative h-3 w-3 shrink-0 rounded-full border-2 border-ink-soft bg-card">
              <span className="cg-plan-dot absolute -inset-0.5 rounded-full bg-ink-soft" />
            </span>
            {/* on the phone the frame is 134px and the pause button takes the corner: name only */}
            <span className="cg-plan-name">
              {name}
              {suffix && <span className="max-md:hidden">{suffix}</span>}
            </span>
          </span>
        ))}
      </div>

      {state !== "whole" && (
        <PauseButton paused={paused} onToggle={() => setPaused((p) => !p)} what={t.pause} bubble="surface" className="bottom-3 right-0 md:bottom-5 md:right-1" />
      )}
    </div>
  );
}
