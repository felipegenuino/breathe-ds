import type { ReactNode, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

/**
 * Biblioteca de ícones do Breathe — conjunto do lucide usado pela família,
 * embutido (SVG inline, sem dependência externa), em `currentColor` e com
 * traço consistente. Os componentes aceitam ícones por slot; estes são o
 * conjunto padrão. Uso: `<IconWind size={20} />` ou injeta num componente.
 */
function stroke(children: ReactNode) {
  return function Icon({ size = 20, strokeWidth = 1.9, ...props }: IconProps & { strokeWidth?: number }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...props}
      >
        {children}
      </svg>
    );
  };
}
function solid(children: ReactNode) {
  return function Icon({ size = 20, ...props }: IconProps) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        {children}
      </svg>
    );
  };
}

/* ── navegação / marca ── */
export const IconHome = stroke(<><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></>);
export const IconMenu = stroke(<><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>);
export const IconX = stroke(<><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>);
export const IconChevronDown = stroke(<path d="m6 9 6 6 6-6" />);
export const IconArrowUpRight = stroke(<><path d="M7 7h10v10" /><path d="M7 17 17 7" /></>);
export const IconGlobe = stroke(<><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20" /></>);

/* ── respiração / clínica / família ── */
export const IconWind = stroke(<><path d="M12.8 19.6A2 2 0 1 0 14 16H2" /><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" /><path d="M9.8 4.4A2 2 0 1 1 11 8H2" /></>);
export const IconActivity = stroke(<path d="M22 12h-4l-3 9L9 3l-3 9H2" />);
export const IconBaby = stroke(<><path d="M9 12h.01" /><path d="M15 12h.01" /><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" /><path d="M20.4 10.5a9 9 0 1 1-16.8 0" /><path d="M12 3c2 0 3.5 1.1 3.5 2.5S14.6 8 13.5 8c-.8 0-1.5-.4-1.5-1" /></>);
export const IconSearch = stroke(<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>);
export const IconUsers = stroke(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>);
export const IconGraduationCap = stroke(<><path d="M22 10 12 5 2 10l10 5z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /><path d="M22 10v6" /></>);
export const IconBook = stroke(<><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" /></>);
export const IconInfo = stroke(<><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>);

/* ── contato ── */
export const IconMapPin = stroke(<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></>);
export const IconPhone = stroke(<path d="M13.8 16.6a1 1 0 0 0 1.2-.3l.4-.5A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.5.4a1 1 0 0 0-.3 1.2 14 14 0 0 0 6.4 6.4" />);
export const IconMail = stroke(<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>);
export const IconMessage = stroke(<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />);
export const IconInstagram = stroke(<><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><path d="M17.5 6.5h.01" /></>);

/* ── mídia ── */
export const IconVideo = stroke(<><path d="m16 10 4.5-2.5v9L16 14" /><rect x="2" y="6" width="14" height="12" rx="2" /></>);
export const IconPlay = solid(<path d="M6 3v18l15-9z" />);
export const IconPause = solid(<><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></>);
export const IconVolume2 = stroke(<><path d="M11 5 6 9H2v6h4l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M19 5a10 10 0 0 1 0 14" /></>);
export const IconQuote = solid(<path d="M9.5 5A4.5 4.5 0 0 0 5 9.5V18h6v-6H8V9.5A1.5 1.5 0 0 1 9.5 8zm9 0A4.5 4.5 0 0 0 14 9.5V18h6v-6h-3V9.5A1.5 1.5 0 0 1 18.5 8z" />);

/** Mapa nome → componente (útil pra grades/demos). */
export const icons = {
  IconHome, IconMenu, IconX, IconChevronDown, IconArrowUpRight, IconGlobe,
  IconWind, IconActivity, IconBaby, IconSearch, IconUsers, IconGraduationCap, IconBook, IconInfo,
  IconMapPin, IconPhone, IconMail, IconMessage, IconInstagram,
  IconVideo, IconPlay, IconPause, IconVolume2, IconQuote,
};
