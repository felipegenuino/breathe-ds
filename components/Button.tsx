import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "solid" | "accent" | "outline" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

const pillBase =
  "inline-flex items-center justify-center gap-2 rounded-pill font-body font-semibold whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50";

/* Variante `link`: ação de texto sublinhada (não é pílula) — o irmão leve do
   botão, mesma tipografia (font-body semibold). Herda a cor do contexto
   (currentColor), então funciona no claro e sobre fundo escuro. O sublinhado
   fica a 50% e fecha no hover; uma seta (ícone passado nos filhos) dá um passo
   pra cima-e-direita. Ignora `size` (é inline, sem pílula). */
const linkBase =
  "group inline-flex items-center gap-1.5 font-body font-semibold underline decoration-[1.5px] decoration-current/50 underline-offset-4 transition-[text-decoration-color,text-underline-offset] duration-200 hover:decoration-current hover:underline-offset-[5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink rounded-[2px] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none [&>svg]:transition-transform [&>svg]:duration-200 hover:[&>svg]:-translate-y-0.5 hover:[&>svg]:translate-x-0.5 motion-reduce:[&>svg]:transform-none";

const variants: Record<Exclude<Variant, "link">, string> = {
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
 * (injete seu Link via wrapper se precisar de roteador), senão `<button>`.
 * Variantes: solid (petróleo), accent (cor de ação), outline, ghost e
 * `link` (ação de texto sublinhada — ex.: "Ver todos", "Ação secundária",
 * "Ver no Google Maps"; herda a cor, serve no claro e no escuro).
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
