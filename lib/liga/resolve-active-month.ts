import { Month, MonthStatus } from "@/lib/types/month";
import { Temporada } from "@/lib/types/temporada";
import { getCurrentMonthId } from "@/lib/utils";

export interface ResolveActiveMonthParams {
  monthId?: string;
  temporadaId?: string;
}

export interface ResolveActiveMonthResult {
  activeTemporadaId: number;
  months: Month[];
  confirmedMonths: Month[];
  currentMonthId: number | undefined;
}

/**
 * Elige el primer candidato que sea un número válido y corresponda a una
 * temporada existente. Se usa para no confiar ciegamente en un
 * searchParam o una cookie que podría apuntar a una temporada borrada.
 *
 * Exportada porque se reutiliza fuera de resolveActiveMonth (p.ej. en
 * LigaNav, que necesita saber la temporada activa pero no los meses).
 */
export function resolveTemporadaId(
  candidates: (string | undefined)[],
  temporadas: Temporada[],
): number {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const id = Number(candidate);
    if (!Number.isNaN(id) && temporadas.some((t) => t.id === id)) {
      return id;
    }
  }
  return temporadas.at(0)?.id ?? 0;
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
  allMonths: Month[],
  temporadas: Temporada[],
  params: ResolveActiveMonthParams,
  cookieTemporadaId?: string,
): ResolveActiveMonthResult {
  const activeTemporadaId = resolveTemporadaId(
    [params.temporadaId, cookieTemporadaId],
    temporadas,
  );

  const months = allMonths.filter((m) => m.temporada_id === activeTemporadaId);

  const confirmedMonths = months.filter(
    (m) => m.status === MonthStatus.Confirmed,
  );

  const currentMonthId =
    (params.monthId ? Number(params.monthId) : undefined) ??
    getCurrentMonthId(confirmedMonths) ??
    confirmedMonths.at(-1)?.id;

  return { activeTemporadaId, months, confirmedMonths, currentMonthId };
}
