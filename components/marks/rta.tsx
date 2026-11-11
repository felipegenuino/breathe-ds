import type { CSSProperties } from "react";

/**
 * Método RTA brand (Reequilíbrio Toracoabdominal), copied from metodorta-next's
 * public/brand/rta-horizontal.svg (the file the site header uses; identical in
 * the linktree). That file already draws the symbol and the name as separate
 * paths: the symbol is the blue path, the "RTA" letters are the three magenta
 * paths. Kept separate here, so the Curtain and the Lockup can assemble the
 * arrangements. Do not edit by hand: the drawing is the one from the logo.
 * The colors are the logo's, not the site tokens.
 */
export const RTA_COLORS = {
  /** Symbol. 3.00:1 on the page #f3f7f8: graphic only, never text. */
  blue: "#159DB0",
  /** "RTA" letters. 5.62:1 on the page #f3f7f8, 6.06:1 on white. */
  magenta: "#A7318D",
} as const;

type SymbolProps = {
  /** Width in px; height follows the aspect ratio (284.8:347.95). */
  size?: number;
  /** Single color (e.g. "#fff" on a dark panel). Default: the logo blue. */
  color?: string;
  className?: string;
  title?: string;
};

/** Box tight to the drawing: 284.8 × 347.95 (exact path bounds in the horizontal logo). */
export function RtaSymbol({ size = 48, color = RTA_COLORS.blue, className, title = "Método RTA" }: SymbolProps) {
  return (
    <svg width={size} height={Math.round((size * 347.95) / 284.8)} viewBox="11 12 284.8 347.95" fill="none" role="img" aria-label={title} className={className}>
      <path d="M143.717 120.6C166.017 81.4298 158.237 6.24981 94.2073 12.3498C79.7273 13.7398 31.0673 30.6298 53.7273 90.2298C73.5973 142.53 124.797 153.84 143.717 120.6ZM230.767 251.45C204.467 278.82 177.987 266.28 165.717 242.74C146.507 205.88 161.997 142.65 219.837 161.12C272.337 177.89 246.027 235.58 230.767 251.45ZM158.357 104C141.457 170.68 117.587 154.67 71.7273 138.29C54.9073 132.26 39.2672 142.48 29.6472 159.31C-14.7328 236.94 22.9972 337.89 112.147 356.1C156.987 365.27 168.217 355.28 157.187 354.51C148.347 353.89 149.847 354.11 142.827 353.14C136.117 352.2 132.667 348.29 143.277 349.23C178.997 352.38 188.617 349.8 188.317 346.87C188.007 343.83 181.907 342.55 175.217 342.08C159.777 341.02 148.907 339.84 142.367 338.15C135.637 336.43 134.047 333.03 143.277 334.27C184.597 339.82 193.357 335.35 191.657 331.61C190.717 329.55 182.647 328.39 172.997 327.31C166.877 326.63 153.797 324.99 145.287 322.49C136.177 319.84 130.557 317.12 151.707 318.16C203.157 320.68 192.747 310.26 166.587 308.51C160.907 308.13 150.577 306.24 143.377 305.39C128.757 303.66 113.457 299.62 142.717 291.92C162.687 286.66 160.417 280.91 131.517 281.02C101.887 281.11 62.5172 266.68 67.0772 215.9C68.7972 196.73 75.3973 188.8 83.7073 188.95C92.0173 189.08 102.037 197.31 110.597 210.44C133.777 246 201.097 325.19 285.147 230.92C339.267 170.21 170.157 57.4598 158.357 104Z" fill={color} />
    </svg>
  );
}

type WordmarkProps = {
  /** Height. Default `var(--cg-wordmark, 1em)`: inside the Lockup/Curtain the
   *  variable comes from the logo's ratio (`wordmarkPerSymbol`); standalone, 1em. */
  height?: string;
  /** Default: the logo magenta (the letters are magenta in the logo, not ink).
   *  Pass `currentColor` or "#fff" for a single-color version on a dark panel. */
  color?: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
};

/** Ratio measured on rta-horizontal.svg (viewBox 0 0 857 372), exact path
 *  bounds: wordmark height ÷ symbol height = 209.25 / 347.95 = 0.6014.
 *  Both are centered on the same line (y 185.975). Pass it as `wordmarkRatio`
 *  to the Lockup/Curtain. In RTA the symbol sits to the left of the name. */
export const RTA_LOCKUP = { wordmarkPerSymbol: 0.601, symbolSide: "left" } as const;

/** Box tight to the letterforms: 509.65 × 209.25. */
export function RtaWordmark({ height = "var(--cg-wordmark, 1em)", color = RTA_COLORS.magenta, className, style, title = "RTA" }: WordmarkProps) {
  return (
    <svg
      viewBox="336.68 81.35 509.65 209.25"
      fill="none"
      role="img"
      aria-label={title}
      className={className}
      style={{ height, width: "auto", aspectRatio: "509.65 / 209.25", display: "block", ...style }}
    >
      <path d="M673.437 131.42C678.937 126.03 681.817 119.44 682.097 111.66V86.6C682.097 86.6 681.917 82.2201 682.107 82.6901L536.447 82.66C531.507 82.65 526.917 83.8601 522.717 86.2901C518.507 88.7201 515.167 92.0601 512.697 96.3101C510.217 100.57 508.887 105.3 508.717 110.52L508.707 138.94L558.397 138.95L558.367 256.75C558.367 262.61 559.817 268.06 562.697 273.09C565.577 278.12 569.467 282.08 574.357 284.97C579.247 287.85 584.727 289.3 590.767 289.3C596.727 289.3 602.097 287.85 606.897 284.97C611.707 282.09 615.547 278.25 618.437 273.44C621.317 268.64 622.767 263.27 622.767 257.32L622.787 139.52L654.217 139.53C661.537 139.53 667.947 136.82 673.437 131.42Z" fill={color} />
      <path d="M842.617 241.87L794.317 117.05C789.837 105.61 780.167 81.3601 780.167 81.3601L745.317 81.3501C734.327 81.3501 724.557 84.4301 716.007 90.6101C707.447 96.7901 700.917 105.6 696.437 117.03L648.077 241.83C645.597 248.69 644.367 254.51 644.367 259.26C644.367 265.67 646.077 271.32 649.507 276.22C652.937 281.11 657.807 284.93 664.127 287.68C668.517 289.61 673.007 290.57 677.587 290.57C684.267 290.57 690.377 288.47 695.907 284.26C701.457 280.05 705.457 274.38 707.927 267.24L711.847 257.9L745.307 146.84L779.047 257.91L782.757 267.26C785.407 274.57 789.497 280.3 795.037 284.42C800.577 288.54 806.597 290.6 813.097 290.6C817.667 290.6 822.157 289.65 826.547 287.71C832.857 284.97 837.737 281.15 841.166 276.26C844.597 271.36 846.327 265.71 846.327 259.3C846.327 254.91 845.077 249.1 842.617 241.87Z" fill={color} />
      <path d="M474.546 204.8L478.516 201.78L484.977 196.7L486.076 195.47C498.796 184.3 505.167 169.34 505.167 150.57C505.177 145.36 504.437 139.45 502.977 132.87C500.517 122.16 496.116 113.02 489.796 105.47C483.486 97.91 475.387 92.1499 465.507 88.1599C455.617 84.1799 444.226 82.1899 431.316 82.1799L336.796 82.1699L336.717 116.49L336.687 255.98C336.687 264.95 339.867 272.66 346.217 279.11C352.577 285.57 360.206 288.89 369.076 289.08C375.116 289.08 380.567 287.63 385.417 284.75C390.267 281.87 394.136 278.01 397.026 273.15C399.906 268.3 401.346 262.86 401.356 256.82V232.28C401.356 232.37 401.346 232.46 401.336 232.56L401.356 139.02H401.656L429.507 139.03H429.796C432.446 139.03 434.827 140.08 436.937 142.18C439.047 144.29 440.137 146.9 440.227 150.01C440.227 153.95 439.106 157.17 436.866 159.69C436.376 160.24 435.856 160.7 435.326 161.13C432.826 164.02 430.167 167.17 426.927 169.21C399.607 189.26 403.227 208.63 410.487 222.31L443.366 271.11C451.506 283.55 461.436 289.78 473.146 289.78C479.646 289.78 485.827 287.68 491.687 283.47C496.167 280.17 499.587 276.22 501.917 271.6C504.247 266.98 505.417 262.15 505.417 257.12C505.417 249.52 503.087 242.65 498.417 236.52L474.546 204.8Z" fill={color} />
    </svg>
  );
}
