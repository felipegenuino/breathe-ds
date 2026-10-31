"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type Labels = {
  close: string;
};
const EN: Labels = { close: "Close" };

type Props = {
  open: boolean;
  /** Called when the person closes it (Esc, the backdrop, the close button). */
  onClose: () => void;
  /** Accessible name of the panel (sr-only unless you render it in `children`). */
  title: string;
  /** Small actions on the top bar, beside the close button ("Copy link", "Event page ↗"). */
  actions?: ReactNode;
  children: ReactNode;
  labels?: Partial<Labels>;
  className?: string;
};

/**
 * Side panel of the Cuidado Global family (Luma's event drawer): a native
 * <dialog> that slides in from the right, full height, up to 32rem wide (full
 * width on the phone), with a top bar (close on the left, actions on the
 * right) and a scrolling body. Focus is trapped by the dialog, Esc and the
 * backdrop close it, focus goes back to what opened it. The content is
 * whatever you pass: a course, an event, a person.
 */
export function SidePanel({ open, onClose, title, actions, children, labels, className = "" }: Props) {
  const t = { ...EN, ...labels };
  const box = useRef<HTMLDialogElement>(null);
  const headingId = useId();

  // open/close follow the prop; the way out waits for the slide to finish.
  // Closed, the dialog is display:none (hidden open:flex): a plain `flex` would
  // keep it rendered off-screen, its shadow bleeding into the right edge and its
  // content reachable.
  useEffect(() => {
    const d = box.current;
    if (!d) return;
    if (open) {
      if (!d.open) d.showModal();
      // paint the closed state first (the dialog was display:none), then open:
      // a forced reflow plus a frame, or the slide would not play
      void d.getBoundingClientRect();
      const frame = requestAnimationFrame(() => d.setAttribute("data-open", ""));
      return () => cancelAnimationFrame(frame);
    }
    if (!d.open) return;
    d.removeAttribute("data-open");
    const wait = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? 0 : 260;
    const timer = window.setTimeout(() => d.close(), wait);
    return () => window.clearTimeout(timer);
  }, [open]);

  // Esc (cancel) and click on the backdrop → the parent closes it
  useEffect(() => {
    const d = box.current;
    if (!d) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    const onClick = (e: MouseEvent) => {
      if (e.target === d) onClose();
    };
    d.addEventListener("cancel", onCancel);
    d.addEventListener("click", onClick);
    return () => {
      d.removeEventListener("cancel", onCancel);
      d.removeEventListener("click", onClick);
    };
  }, [onClose]);

  return (
    <dialog
      ref={box}
      aria-labelledby={headingId}
      className={`fixed inset-y-0 right-0 left-auto m-0 hidden open:flex h-dvh max-h-none w-[min(100vw,32rem)] max-w-none translate-x-full flex-col overflow-hidden bg-card p-0 text-ink shadow-2xl [transition:translate_280ms_var(--ease-cg)] data-open:translate-x-0 motion-reduce:transition-none backdrop:bg-ink/50 backdrop:backdrop-blur-sm backdrop:opacity-0 backdrop:[transition:opacity_240ms_ease-out] [&[data-open]::backdrop]:opacity-100 ${className}`}
    >
      <h2 id={headingId} className="sr-only">{title}</h2>
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-ink/10 px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors duration-150 hover:bg-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none"
        >
          <X aria-hidden="true" size={20} strokeWidth={2} />
          <span className="sr-only">{t.close}</span>
        </button>
        {actions && <div className="flex flex-wrap items-center justify-end gap-2">{actions}</div>}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
    </dialog>
  );
}
