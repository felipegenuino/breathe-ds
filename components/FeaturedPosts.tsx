import type { ElementType, ReactNode } from "react";
import { Byline, type Person } from "./Byline";
import type { PostCover } from "./PostCard";

export type FeaturedPost = {
  cover: PostCover;
  title: ReactNode;
  /** The post's own page. */
  href: string;
  text: ReactNode;
  /** Who said it (name, portrait): the text is their words, only cut. */
  speaker: Person;
  /** Link to the video the text came from ("Watch the video ↗"). */
  video?: { href: string; label?: ReactNode; external?: boolean };
};

type Props = {
  posts: FeaturedPost[];
  headingLevel?: "h2" | "h3";
  /** Default label of the video link. */
  watchLabel?: ReactNode;
  newTabLabel?: string;
  linkComponent?: ElementType;
  className?: string;
};

/**
 * Featured posts of the Cuidado Global family — creeta's `Temas` ("in the
 * words of who treats you"): what the team explains in the videos, as text.
 * Each card: the cover above, the title and the text, and at the foot who
 * said it (with the portrait) and the link to the video, because the text is
 * their speech, only with cuts. Bento: the first post takes two columns with
 * the cover beside the text; if the last would sit alone in its row, it too.
 */
export function FeaturedPosts({ posts, headingLevel: Title = "h3", watchLabel = "Watch the video", newTabLabel, linkComponent, className = "" }: Props) {
  const L: ElementType = linkComponent ?? "a";
  return (
    <ul className={`grid list-none gap-3 md:grid-cols-2 md:gap-5 ${className}`}>
      {posts.map((p, i) => {
        const wide = i === 0 || (i === posts.length - 1 && (posts.length - 1) % 2 === 1);
        return (
          <li key={i} className={`flex flex-col overflow-hidden rounded-[28px] bg-card ${wide ? "md:col-span-2 md:grid md:grid-cols-5" : ""}`}>
            {/* cover: decoration (4:3); the title says the subject */}
            <div className={`relative overflow-hidden ${wide ? "aspect-[4/3] md:col-span-2 md:aspect-auto md:min-h-[320px]" : "aspect-[4/3]"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.cover.src}
                srcSet={p.cover.srcSet}
                sizes={p.cover.sizes ?? (wide ? "(min-width: 1152px) 440px, (min-width: 768px) 40vw, 92vw" : "(min-width: 1152px) 540px, (min-width: 768px) 46vw, 92vw")}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
              />
            </div>

            <div className={`flex flex-1 flex-col p-6 md:p-8 ${wide ? "md:col-span-3 md:justify-center" : ""}`}>
              <Title className="font-heading text-xl font-medium leading-snug text-ink md:text-[1.375rem]">
                <L
                  href={p.href}
                  className="underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink motion-reduce:transition-none"
                >
                  {p.title}
                </L>
              </Title>
              <p className="mt-3 leading-relaxed text-ink-body">{p.text}</p>
              <Byline
                className="mt-auto pt-6"
                people={[p.speaker]}
                action={p.video ? { label: p.video.label ?? watchLabel, href: p.video.href, external: p.video.external } : undefined}
                newTabLabel={newTabLabel}
                linkComponent={linkComponent}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
