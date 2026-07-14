import { MonthRow } from "@/lib/types/month";
import { SeasonRow } from "@/lib/types/season";
import { getCurrentMonthId } from "@/lib/utils";

export interface ResolveActiveMonthParams {
  monthId?: string;
  temporadaId?: string;
}

export interface ResolveActiveMonthResult {
  activeTemporadaId: number;
  months: MonthRow[];
  confirmedMonths: MonthRow[];
  currentMonthId: number | undefined;
}

export function resolveSeasonId(
  candidates: (string | undefined)[],
  seasons: SeasonRow[],
): number {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const id = Number(candidate);
    if (!Number.isNaN(id) && seasons.some((t) => t.id === id)) {
      return id;
    }
  }
  return seasons.at(0)?.id ?? 0;
}

/**
 * Dado el listado completo de meses/temporadas, los searchParams de la
 * página y (opcionalmente) el valor de la cookie `temporadaId` leído en el
 * server component, resuelve qué temporada y qué mes están activos.
 *
 * Prioridad: searchParam > cookie > primera temporada disponible. Al leer
 * la cookie aquí (server-side) evitamos tener que hacer un redirect desde
 * el cliente para sincronizar la URL con la preferencia guardada.
 *
 * Se extrajo del componente de página para poder reutilizarlo (p.ej. en el
 * MonthSelector, en tests, o en otras vistas que necesiten el mismo cálculo)
 * sin duplicar la lógica.
 */
export function resolveActiveMonth(
  allMonths: MonthRow[],
  temporadas: SeasonRow[],
  params: ResolveActiveMonthParams,
  cookieTemporadaId?: string,
): ResolveActiveMonthResult {
  const activeTemporadaId = resolveSeasonId(
    [params.temporadaId, cookieTemporadaId],
    temporadas,
  );

  const months = allMonths.filter((m) => m.season_id === activeTemporadaId);

  const confirmedMonths = months.filter((m) => m.status === "confirmed");

  const currentMonthId =
    (params.monthId ? Number(params.monthId) : undefined) ??
    getCurrentMonthId(confirmedMonths) ??
    confirmedMonths.at(-1)?.id;

  return { activeTemporadaId, months, confirmedMonths, currentMonthId };
}
