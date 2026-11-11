/**
 * @breathe-ds/ui/brand — the brand guidelines of the Cuidado Global family,
 * transcribed from the official manuals (by crismacari.com). Readable guide:
 * brand/README.md. Every value carries `source: { file, page }`.
 */
import type { Brand } from "./types";
import { cuidadoGlobal } from "./cuidado-global";
import { creeta } from "./creeta";
import { ttcab } from "./ttcab";
import { rta } from "./rta";
import { rtaMundi } from "./rta-mundi";

export * from "./types";
export * from "./contrast";
export { cuidadoGlobal, creeta, ttcab, rta, rtaMundi };

/** Family order: the mother brand first, then the sub-brands, then the event. */
export const BRANDS: readonly Brand[] = [cuidadoGlobal, creeta, ttcab, rta, rtaMundi];

export const BRAND_BY_ID: Record<Brand["id"], Brand> = {
  "cuidado-global": cuidadoGlobal,
  creeta,
  ttcab,
  rta,
  "rta-mundi": rtaMundi,
};

/** The family petrol, printed in every manual with a written palette (#144753). Used as the dark reference for contrast. */
export const FAMILY_PETROL = "#144753";
