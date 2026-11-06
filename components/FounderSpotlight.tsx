import type { ReactNode } from "react";
import { ProfileSpotlight } from "./ProfileSpotlight";
import { IconGraduationCap, IconInstagram } from "./icons";

/**
 * The founder of the family: Mariangela Pinheiro de Lima, who created the RTA
 * Method and TTCAB. One block, one text, for every site of the family (ttcab,
 * metodorta, creeta…), so she reads the same everywhere. The text is the one
 * validated on the ttcab site (06/11/2026), in pt, en and es. THIS FILE IS THE
 * SOURCE OF TRUTH of her bio: change it here, publish, bump the sites.
 * In the bio, [[rta:…]] and [[ttcab:…]] become links to each method's site
 * (the site you are on is not linked to itself: see `site`).
 *
 * Media stay in each site's `public/` (the package ships no binaries); copy them
 * from the ttcab site, or pass your own paths:
 *   /images/mariangela.png               still portrait (4:5)
 *   /equipe/vivas/mariangela.mp4 + .webp living portrait (plays on hover)
 */
export const FOUNDER = {
  name: "Mariangela Pinheiro de Lima",
  registration: "CREFITO-10/2894-F",
  instagram: "https://www.instagram.com/mariangela.rta/",
  courses: "https://metodorta.com.br/cursos-e-eventos/",
  /** Sites of each method, linked from the bio ([[rta:…]] / [[ttcab:…]] in the text). */
  sites: { rta: "https://metodorta.com.br/", ttcab: "https://torcicoloseassimetrias.com.br/" },
  pt: {
    eyebrow: "Idealizadora",
    role: "Criadora do método Reequilíbrio Toracoabdominal e fundadora da Escola Brasileira de RTA e Biomecânica Respiratória",
    roleShort: "Criadora do Método RTA e do TTCAB",
    bio: "Mariangela tem mais de 40 anos de carreira na Fisioterapia, com experiências marcantes na área pediátrica e respiratória. Iniciou como professora na PUCPR e atuou por sete anos nos hospitais Pequeno Príncipe e César Pernetta, em Curitiba. Especializou-se no Método Bobath, com influência de Oacy Veronesi e Sherry Arndt. Seu interesse em Fisioterapia Respiratória a levou a criar o [[rta:Método Reequilíbrio Toracoabdominal (RTA)]], difundido há mais de três décadas por todo o Brasil. Também idealizou o [[ttcab:TTCAB]], a formação para o tratamento do torcicolo congênito e de outras assimetrias no bebê.",
    instagram: "Instagram da Mariangela",
    courses: "Cursos no site do Método RTA",
    newTab: "(abre em nova aba)",
  },
  en: {
    eyebrow: "Founder",
    role: "Creator of the Reequilíbrio Toracoabdominal method and founder of the Escola Brasileira de RTA e Biomecânica Respiratória",
    roleShort: "Creator of the RTA Method and of TTCAB",
    bio: "Mariangela has a career of more than 40 years in Physiotherapy, with remarkable experience in paediatrics and respiratory care. She began as a lecturer at PUCPR and worked for seven years at the Pequeno Príncipe and César Pernetta hospitals in Curitiba. She specialised in the Bobath Concept, influenced by Oacy Veronesi and Sherry Arndt. Her interest in Respiratory Physiotherapy led her to create the [[rta:Thoracoabdominal Rebalancing Method (RTA)]], taught across Brazil for more than three decades. She also created [[ttcab:TTCAB]], the training in the treatment of congenital torticollis and other asymmetries in babies.",
    instagram: "Mariangela's Instagram",
    courses: "Courses on the Método RTA website",
    newTab: "(opens in a new tab)",
  },
  es: {
    eyebrow: "Idealizadora",
    role: "Creadora del método Reequilíbrio Toracoabdominal y fundadora de la Escola Brasileira de RTA e Biomecânica Respiratória",
    roleShort: "Creadora del Método RTA y del TTCAB",
    bio: "Mariangela tiene más de 40 años de carrera en la Fisioterapia, con experiencias destacadas en el área pediátrica y respiratoria. Comenzó como profesora en la PUCPR y trabajó durante siete años en los hospitales Pequeno Príncipe y César Pernetta, en Curitiba. Se especializó en el Método Bobath, con influencia de Oacy Veronesi y Sherry Arndt. Su interés por la Fisioterapia Respiratoria la llevó a crear el [[rta:Método Reequilibrio Toracoabdominal (RTA)]], difundido desde hace más de tres décadas en todo Brasil. También ideó el [[ttcab:TTCAB]], la formación para el tratamiento de la tortícolis congénita y otras asimetrías en el bebé.",
    instagram: "Instagram de Mariangela",
    courses: "Cursos en el sitio del Método RTA",
    newTab: "(se abre en una pestaña nueva)",
  },
} as const;

export type FounderLocale = "pt" | "en" | "es";

type Props = {
  locale?: FounderLocale;
  /** The site showing the block: its own method is not linked to itself. */
  site?: "rta" | "ttcab";
  /** Where "courses" points (default: the Método RTA courses page). */
  coursesHref?: string;
  /** Media paths in the site's public/ (defaults above). */
  photo?: string;
  living?: { src: string; poster: string } | false;
  /** Your own image element (e.g. next/image) in place of the photo. */
  media?: ReactNode;
  /** Links or buttons at the foot, after the text. */
  actions?: ReactNode;
  variant?: "plain" | "card";
  headingLevel?: "h2" | "h3";
  id?: string;
  className?: string;
};

/**
 * Founder spotlight: `ProfileSpotlight` (card, living portrait on hover) filled
 * with the founder's validated text, her Instagram and the courses link. Sites
 * only drop it in: `<FounderSpotlight locale="pt" />`.
 */
/** Bio as plain text (JSON-LD, llms.txt, meta): the markers removed. */
export function founderBio(locale: FounderLocale = "pt"): string {
  return FOUNDER[locale].bio.replace(/\[\[(?:rta|ttcab):([^\]]+)\]\]/g, "$1");
}

/** Bio with the method names as links (same tab: these are family sites). */
function BioLinks({ text, site }: { text: string; site?: "rta" | "ttcab" }) {
  const parts = text.split(/(\[\[(?:rta|ttcab):[^\]]+\]\])/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[\[(rta|ttcab):([^\]]+)\]\]$/);
        if (!m) return p;
        const key = m[1] as "rta" | "ttcab";
        if (key === site) return m[2];
        return (
          <a key={i} href={FOUNDER.sites[key]} className="font-semibold text-ink underline decoration-1 underline-offset-4 hover:decoration-2">
            {m[2]}
          </a>
        );
      })}
    </>
  );
}

export function FounderSpotlight({
  locale = "pt",
  site,
  coursesHref = FOUNDER.courses,
  photo = "/images/mariangela.png",
  living = { src: "/equipe/vivas/mariangela.mp4", poster: "/equipe/vivas/mariangela.webp" },
  media,
  actions,
  variant = "card",
  headingLevel = "h2",
  id,
  className,
}: Props) {
  const t = FOUNDER[locale];
  return (
    <ProfileSpotlight
      variant={variant}
      headingLevel={headingLevel}
      id={id}
      className={className}
      eyebrow={t.eyebrow}
      name={FOUNDER.name}
      role={t.role}
      registration={FOUNDER.registration}
      bio={<BioLinks text={t.bio} site={site} />}
      photo={{ src: photo, alt: FOUNDER.name }}
      living={living || undefined}
      media={media}
      actions={actions}
      social={[
        { label: t.instagram, href: FOUNDER.instagram, Icon: IconInstagram },
        { label: t.courses, href: coursesHref, Icon: IconGraduationCap },
      ]}
      newTabLabel={t.newTab}
    />
  );
}
