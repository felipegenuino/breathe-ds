import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "solid" | "accent" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-heading font-semibold whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // petróleo sólido, texto creme (ex.: "Falar com a equipe")
  solid: "bg-ink text-surface hover:-translate-y-0.5 shadow-[0_6px_18px_rgba(20,71,83,0.28)]",
  // cor de ação (laranja/magenta) + texto on-action (do token, varia por site)
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
 * Button da família Cuidado Global. Polimórfico: com `href` vira `<a>`
 * (injete seu Link via `as`/wrapper se precisar de roteador), senão `<button>`.
 * Variantes: solid (petróleo), accent (cor de ação), outline, ghost.
 */
export function Button(props: ButtonProps | LinkProps) {
  const { variant = "solid", size = "md", className = "", children, ...rest } = props;
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
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
