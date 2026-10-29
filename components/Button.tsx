import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "solid" | "accent" | "outline" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

const pillBase =
  "inline-flex items-center justify-center gap-2 rounded-pill font-body font-semibold whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50";

/* `link` variant: underlined text action (not a pill) — the button's lightweight
   sibling, same typography (font-body semibold). Inherits the color from the
   context (currentColor), so it works on light and on dark backgrounds. The
   underline sits at 50% and goes solid on hover; an arrow (icon passed as a
   child) nudges up-and-right. Ignores `size` (it is inline, no pill). */
const linkBase =
  "group inline-flex items-center gap-1.5 font-body font-semibold underline decoration-[1.5px] decoration-current/50 underline-offset-4 transition-[text-decoration-color,text-underline-offset] duration-200 hover:decoration-current hover:underline-offset-[5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink rounded-[2px] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none [&>svg]:transition-transform [&>svg]:duration-200 hover:[&>svg]:-translate-y-0.5 hover:[&>svg]:translate-x-0.5 motion-reduce:[&>svg]:transform-none";

const variants: Record<Exclude<Variant, "link">, string> = {
  // solid petrol, cream text (e.g. "Falar com a equipe")
  solid: "bg-ink text-surface hover:-translate-y-0.5 shadow-[0_6px_18px_rgba(20,71,83,0.28)]",
  // action color (orange/magenta) + on-action text (from the token, varies per site)
  accent: "bg-action text-on-action hover:-translate-y-0.5 shadow-[0_6px_18px_rgba(20,71,83,0.22)]",
  outline: "border border-line text-ink hover:bg-ink/[0.05]",
  ghost: "text-ink hover:bg-ink/[0.06]",
};

const sizes: Record<Size, string> = {
  sm: "min-h-9 px-4 text-sm",
  md: "min-h-11 px-5 text-[0.95rem]",
  lg: "min-h-[52px] px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/**
 * Button of the Cuidado Global family. Polymorphic: with `href` it renders an
 * `<a>` (inject your Link via a wrapper if you need a router), otherwise a
 * `<button>`. Variants: solid (petrol), accent (action color), outline, ghost
 * and `link` (underlined text action — e.g. "See all", "Secondary action",
 * "View on Google Maps"; inherits the color, works on light and dark).
 */
export function Button(props: ButtonProps | LinkProps) {
  const { variant = "solid", size = "md", className = "", children, ...rest } = props;
  const cls =
    variant === "link"
      ? `${linkBase} ${className}`
      : `${pillBase} ${variants[variant]} ${sizes[size]} ${className}`;
  if ("href" in props && props.href !== undefined) {
    const { href, ...a } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <a href={href} className={cls} {...a}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
