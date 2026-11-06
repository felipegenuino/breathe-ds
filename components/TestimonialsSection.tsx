import type { ComponentProps } from "react";
import { SectionHeading } from "./Heading";
import { TestimonialCard } from "./TestimonialCard";

/**
 * Testimonials block of the family (0.6.10, 06/11/2026): the ttcab section made
 * the standard. Heading "Depoimentos / Histórias de sucesso", cards in two
 * masonry columns (short and long quotes have different heights), the video
 * testimonial first, every card a pull quote that opens the whole testimonial in
 * the side panel. Sites pass only the testimonials; the copy and the settings
 * are the ones validated on ttcab. Put it inside your section's Container.
 */
const COPY = {
  pt: { eyebrow: "Depoimentos", title: "Histórias de sucesso", panel: "Depoimento", readMore: "Ler depoimento completo", watchFull: "Assistir ao depoimento", close: "Fechar", newTab: " (abre em nova aba)", and: " e " },
  en: { eyebrow: "Testimonials", title: "Success stories", panel: "Testimonial", readMore: "Read the full testimonial", watchFull: "Watch the testimonial", close: "Close", newTab: " (opens in a new tab)", and: " and " },
  es: { eyebrow: "Testimonios", title: "Historias de éxito", panel: "Testimonio", readMore: "Leer el testimonio completo", watchFull: "Ver el testimonio", close: "Cerrar", newTab: " (se abre en una pestaña nueva)", and: " y " },
} as const;

type CardProps = ComponentProps<typeof TestimonialCard>;

/** One testimonial: what the card needs (the settings come from the block). */
export type Testimonial = Pick<CardProps, "quote" | "excerpt" | "excerptMarks" | "author" | "authorPhoto" | "authors" | "role" | "video" | "photo"> & { id: string | number };

type Props = {
  items: Testimonial[];
  locale?: "pt" | "en" | "es";
  /** Override the heading only when the client asks; the default is the standard. */
  eyebrow?: string;
  title?: string;
  /** Override labels (e.g. close from the site's own dictionary). */
  labels?: CardProps["labels"];
  /** id for the heading (aria-labelledby of the section). */
  headingId?: string;
};

export function TestimonialsSection({ items, locale = "pt", eyebrow, title, labels, headingId }: Props) {
  const c = COPY[locale];
  // o vídeo primeiro (como no ttcab); o resto na ordem recebida
  const sorted = [...items].sort((a, b) => Number(Boolean(b.video)) - Number(Boolean(a.video)));
  return (
    <>
      <SectionHeading id={headingId} eyebrow={eyebrow ?? c.eyebrow} title={title ?? c.title} />
      <ul className="mt-10 list-none gap-4 p-0 md:columns-2">
        {sorted.map(({ id, ...item }) => (
          <TestimonialCard
            key={id}
            as="li"
            className="mb-4 break-inside-avoid"
            {...item}
            joiners={{ sep: ", ", last: c.and }}
            mediaPlacement="panel"
            clampLines={5}
            panel={{ eyebrow: c.panel }}
            labels={{ watch: "{description}", readMore: c.readMore, watchFull: c.watchFull, close: c.close, newTab: c.newTab, ...labels }}
          />
        ))}
      </ul>
    </>
  );
}
