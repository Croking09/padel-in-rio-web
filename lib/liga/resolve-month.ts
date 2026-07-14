import { MonthRow } from "@/lib/types/month";
import { getCurrentMonthId } from "@/lib/utils";
import {
  getActiveSeason,
  ActiveSeasonParams,
  ActiveSeasonResult,
} from "@/lib/liga/resolve-season";
import { getMonthsBySeason } from "@/app/actions/month-actions";

interface ActiveMonthParams extends ActiveSeasonParams {
  monthId?: string;
}

interface ResolveActiveMonthResult {
  confirmedMonths: MonthRow[];
  currentMonthId: number | undefined;
}

export function resolveActiveMonth(
  months: MonthRow[],
  params: Pick<ActiveMonthParams, "monthId">,
): ResolveActiveMonthResult {
  const confirmedMonths = months.filter((m) => m.status === "confirmed");

  const currentMonthId =
    (params.monthId ? Number(params.monthId) : undefined) ??
    getCurrentMonthId(confirmedMonths) ??
    confirmedMonths.at(-1)?.id;

  return { confirmedMonths, currentMonthId };
}

export interface ActiveMonthResult
  extends ResolveActiveMonthResult, ActiveSeasonResult {
  months: MonthRow[];
}

export async function getActiveMonth(
  searchParams: Promise<ActiveMonthParams> | ActiveMonthParams,
): Promise<ActiveMonthResult> {
  const params = await searchParams;
  const { seasonId, seasons } = await getActiveSeason(params);
  const months = await getMonthsBySeason(seasonId);

  const monthResult = resolveActiveMonth(months, params);

  return { ...monthResult, months, seasonId, seasons };
}
