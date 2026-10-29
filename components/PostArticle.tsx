import type { ReactNode } from "react";
import type { PostDate } from "./PostCard";

type Labels = {
  /** sr-only before the date. */
  publishedOn: string;
  /** sr-only heading of the aside (the video). */
  aside: string;
};
const EN: Labels = { publishedOn: "Published on", aside: "Watch" };

type Props = {
  /** The trail above the title (a Breadcrumb). */
  trail?: ReactNode;
  title: ReactNode;
  /** Who signs (a PersonChip). */
  signature?: ReactNode;
  date?: PostDate;
  /** The text, one entry per paragraph: the first one is the lead, larger. */
  paragraphs: ReactNode[];
  /** Small line under a hairline at the end of the text ("This text guides, but…"). */
  notice?: ReactNode;
  /** Right column from md, sticky: the video the text came from (a VideoStoryCard). */
  aside?: ReactNode;
  /** The video's speech, in full, open: here it is the body of the page, not an extra. */
  transcript?: { title: ReactNode; note?: ReactNode; paragraphs: ReactNode[]; lang?: string };
  /** After the article: "other posts" (a heading and a grid of PostCard), the final call… */
  children?: ReactNode;
  labels?: Partial<Labels>;
  className?: string;
};

/**
 * Post page of the Cuidado Global family — creeta's `OrientacaoTela`, by
 * tokens. Order: the trail, the title, who signs and when; the text, which
 * answers at once; the video the text came from and, in full, what is said in
 * it. On the phone they come in reading order (text, video, transcript); from
 * md the video goes to the right column, sticky, and follows the reading.
 */
export function PostArticle({ trail, title, signature, date, paragraphs, notice, aside, transcript, children, labels, className = "" }: Props) {
  const t = { ...EN, ...labels };
  return (
    <article className={className}>
      {trail}

      <header className="mt-3 max-w-3xl md:mt-5">
        <h1 className="font-heading text-[2rem] font-medium leading-[1.08] tracking-[-0.02em] text-ink md:text-5xl">{title}</h1>
        {(signature || date) && (
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-body">
            {signature}
            {date && (
              <time dateTime={date.iso}>
                <span className="sr-only">{t.publishedOn} </span>
                {date.label}
              </time>
            )}
          </div>
        )}
      </header>

      {/* Three pieces in a grid. On the phone in reading order: the text (the
          answer), the video, the transcript. From md the video takes the right
          column and follows the reading of the other two. */}
      <div className="mt-8 grid gap-3 md:mt-10 md:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] md:items-start md:gap-5">
        <section className="rounded-[28px] bg-card p-6 md:col-start-1 md:p-10">
          {paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "text-lg leading-relaxed text-ink md:text-xl" : "mt-4 leading-relaxed text-ink-body"}>
              {p}
            </p>
          ))}
          {notice && <p className="mt-6 border-t border-ink/10 pt-4 text-sm text-ink-body">{notice}</p>}
        </section>

        {aside && (
          <aside className="md:sticky md:top-28 md:col-start-2 md:row-span-2 md:row-start-1">
            <h2 className="sr-only">{t.aside}</h2>
            {aside}
          </aside>
        )}

        {transcript && transcript.paragraphs.length > 0 && (
          <section className="rounded-[28px] bg-card p-6 md:col-start-1 md:p-10">
            <h2 className="font-heading text-[1.375rem] font-medium leading-snug text-ink md:text-2xl">{transcript.title}</h2>
            {transcript.note && <p className="mt-2 text-sm font-medium text-ink">{transcript.note}</p>}
            <div lang={transcript.lang} className="mt-4 space-y-4 leading-relaxed text-ink-body">
              {transcript.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        )}
      </div>

      {children}
    </article>
  );
}
