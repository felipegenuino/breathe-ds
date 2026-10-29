import type { ReactNode } from "react";
import { VideoInviteCard, type VideoInviteCardProps } from "./VideoInviteCard";

type Props = {
  /** The question that closes the page, e.g. "Shall we find out what your body needs?". */
  title: ReactNode;
  /** Supporting line under the title. Omit it to drop the paragraph. */
  lead?: ReactNode;
  /** The call to action — pass the DS `Button` (variant="accent" on the family's sites). */
  action: ReactNode;
  /** Side card with the speaker's video (VideoInviteCard props). Omit for the text card alone. */
  video?: Omit<VideoInviteCardProps, "className">;
  /** Any other side media (e.g. a still photo), placed in the same frame as the video. */
  media?: ReactNode;
  className?: string;
};

/** Side frame: 3:2 on mobile (video on top), free height from md on, same radius as the text card. */
const sideFrame = "aspect-[3/2] md:order-2 md:aspect-auto md:min-h-[340px]";

/**
 * Final call of the Cuidado Global family — mirrors the `ChamadaFinal` of
 * novo.creeta with the Breathe tokens: every page ends with the same
 * invitation, in the same place.
 *
 * Two cards side by side, on the same grid as the site's other card pairs
 * (gap-3, gap-5 from md): the text on a white card — title, lead and the CTA —
 * and the video on another, each with its own four corners (28px). On mobile
 * the video comes first. Without video/media it is a single card.
 *
 * The white card keeps ink text (10.21:1 on creeta); the lead is ink at 80%
 * (5.78:1 on white). The CTA is a slot: the site passes its own Button/link.
 */
export function CtaCard({ title, lead, action, video, media, className = "" }: Props) {
  const hasSide = Boolean(video || media);

  return (
    <section className={`text-ink ${hasSide ? "grid gap-3 md:grid-cols-2 md:gap-5" : ""} ${className}`}>
      {video ? (
        <VideoInviteCard {...video} className={sideFrame} />
      ) : media ? (
        <div className={`relative overflow-hidden rounded-2xl ${sideFrame}`}>{media}</div>
      ) : null}
      <div className="flex flex-col justify-center rounded-2xl bg-white px-6 py-10 md:px-10 md:py-14">
        <h2 className="max-w-xl font-heading text-3xl leading-[1.1] font-medium md:text-4xl">{title}</h2>
        {lead && <p className="mt-4 max-w-md text-ink/80">{lead}</p>}
        {/* The button follows the site's pattern (accent on white), same as the header's "Book". */}
        <div className="mt-7">{action}</div>
      </div>
    </section>
  );
}
