"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Clock } from "lucide-react";
import { reducedMotion, useOnAppear } from "./useOnAppear";
import { PauseButton } from "./PauseButton";

export type ChatMessage = { from: "person" | "clinic"; text: string };

type Labels = {
  /** Completes the pause button's name: "Pause the sample conversation". */
  pause: string;
};
const EN: Labels = { pause: "the sample conversation" };

type Props = {
  messages: ChatMessage[];
  /** Small line at the top, with a clock: the opening hours. */
  hours?: string;
  labels?: Partial<Labels>;
  className?: string;
};

/** How long the clinic is "typing" before each reply, in ms. */
const TYPING = 1100;
/** At the end the conversation rests this long, fades out and restarts. */
const REST = 3200;
const EXIT = 350;
/** Time to read the previous message before the next: grows with its length, 0.9s to 1.9s. */
export const readingTime = (previous?: ChatMessage) =>
  previous ? Math.min(1900, Math.max(900, 600 + previous.text.length * 28)) : 400;

const BUBBLE = "cg-bubble max-w-[15rem] rounded-[20px] px-4 py-3 text-sm leading-snug lg:text-[0.9375rem]";
const CURVE = "cubic-bezier(0.23, 1, 0.32, 1)";

/**
 * Step 1 of the care flow (creeta's `Conversa`): a sample conversation, bubble
 * by bubble. The person writes, the clinic "types" and answers.
 * - Starts when half of it is on screen and loops: at the end rests 3.2s,
 *   fades and restarts. Only runs while on screen.
 * - Works like a real chat: fixed height, new bubbles come in at the bottom,
 *   old ones slide up and vanish at the top. Nothing pushes the page.
 * - Moves by itself for more than 5s, so it has a pause button (WCAG 2.2.2).
 * - Without JavaScript, IntersectionObserver or with reduced motion, the whole
 *   conversation shows still, without the button.
 * - The chat is decoration (aria-hidden): the step's text already says what
 *   matters. The button stays outside it, for the keyboard and screen reader.
 */
export function ChatPreview({ messages, hours, labels, className = "" }: Props) {
  const t = { ...EN, ...labels };
  const { ref, state, onScreen } = useOnAppear<HTMLDivElement>();
  const stack = useRef<HTMLDivElement>(null);
  const height = useRef(0);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [paused, setPaused] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const visible = state === "whole" ? messages : state === "waiting" ? [] : messages.slice(0, shown);

  // The clock: one message at a time, and back to the start.
  useEffect(() => {
    if (state !== "playing" || paused || !onScreen) return;
    const wait = readingTime(messages[shown - 1]);
    const timer =
      shown >= messages.length
        ? leaving
          ? setTimeout(() => {
              setShown(0);
              setLeaving(false);
            }, EXIT)
          : setTimeout(() => setLeaving(true), REST)
        : messages[shown].from === "person"
          ? setTimeout(() => setShown((v) => v + 1), wait + 300)
          : typing
            ? setTimeout(() => {
                setTyping(false);
                setShown((v) => v + 1);
              }, TYPING)
            : setTimeout(() => setTyping(true), wait);
    return () => clearTimeout(timer);
  }, [state, paused, onScreen, shown, typing, leaving, messages]);

  // New bubble at the bottom: the stack grows upward at once. To slide the old
  // ones up, it starts offset by the height it gained and returns (transform only).
  useLayoutEffect(() => {
    const el = stack.current;
    if (!el) return;
    const gained = el.offsetHeight - height.current;
    height.current = el.offsetHeight;
    if (state !== "playing" || gained <= 0 || reducedMotion() || !el.animate) return;
    el.animate([{ transform: `translateY(${gained}px)` }, { transform: "translateY(0)" }], { duration: 320, easing: CURVE });
  }, [state, shown, typing]);

  return (
    <div ref={ref} data-state={state} data-paused={paused ? "" : undefined} className={`cg-chat relative h-full min-h-[17.5rem] md:min-h-[20rem] ${className}`}>
      <div aria-hidden="true">
        {hours && (
          <span className="absolute left-4 top-0 flex h-11 items-center gap-1.5 text-xs font-medium text-ink/80 lg:left-7">
            <Clock size={13} strokeWidth={2} />
            {hours}
          </span>
        )}
        {/* the chat window: what goes past the top fades out */}
        <div className="absolute inset-x-0 bottom-0 top-11 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_2rem)]">
          <div
            ref={stack}
            className={`absolute inset-x-0 bottom-0 flex flex-col gap-2.5 px-4 pb-4 transition-opacity duration-300 ease-out motion-reduce:transition-none lg:px-7 lg:pb-7 ${leaving ? "opacity-0" : ""}`}
          >
            {visible.map((m, i) => (
              <span
                key={i}
                className={
                  m.from === "person"
                    ? `${BUBBLE} origin-bottom-right self-end rounded-br-md bg-ink text-surface`
                    : `${BUBBLE} origin-bottom-left self-start rounded-bl-md bg-card text-ink`
                }
              >
                {m.text}
              </span>
            ))}
            {typing && (
              <span className="cg-bubble cg-typing flex origin-bottom-left gap-1 self-start rounded-[20px] rounded-bl-md bg-card px-4 py-3.5">
                {[0, 1, 2].map((n) => (
                  <i key={n} style={{ "--n": n } as CSSProperties} className="h-1.5 w-1.5 rounded-full bg-ink-soft" />
                ))}
              </span>
            )}
          </div>
        </div>
      </div>

      {state !== "whole" && (
        <PauseButton paused={paused} onToggle={() => setPaused((p) => !p)} what={t.pause} className="right-0 top-0 lg:right-2" />
      )}
    </div>
  );
}
