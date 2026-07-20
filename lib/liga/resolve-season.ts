import { cookies } from "next/headers";
import { getAllSeasons } from "@/app/actions/season-actions";
import { SeasonRow } from "@/lib/types/season";

export function resolveSeasonId(
  candidates: (string | undefined)[],
  seasons: SeasonRow[],
): number {
  for (const candidate of candidates) {
    if (!candidate) continue;
    const id = Number(candidate);
    if (!Number.isNaN(id) && seasons.some((s) => s.id === id)) {
      return id;
    }
  }
  return seasons.at(0)?.id ?? 0;
}

export interface ActiveSeasonParams {
  seasonId?: string;
}

export interface ActiveSeasonResult {
  seasonId: number;
  seasons: SeasonRow[];
}

export async function getActiveSeason(
  searchParams: Promise<ActiveSeasonParams> | ActiveSeasonParams,
): Promise<ActiveSeasonResult> {
  const [seasons, params, cookieStore] = await Promise.all([
    getAllSeasons(),
    Promise.resolve(searchParams),
    cookies(),
  ]);

  const seasonId = resolveSeasonId(
    [params.seasonId, cookieStore.get("seasonId")?.value],
    seasons,
  );

  return { seasonId, seasons };
}