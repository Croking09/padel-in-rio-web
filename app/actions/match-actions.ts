"use server";

import { matchService } from "@/server/services/match-service";
import { cacheLife, cacheTag } from "next/cache";

export async function getMatchesByMonth(monthId: number) {
  "use cache";
  cacheLife("days");
  cacheTag("matches");
  return matchService.getMatchesByMonth(monthId);
}

// Returns a list of match_id that have results registered
export async function getMatchesWithResults(matchIds: number[]) {
  "use cache";
  cacheLife("days");
  cacheTag("matches");
  return matchService.getMatchesWithResults(matchIds);
}

export async function getMatchResults(matchId: number) {
  "use cache";
  cacheLife("days");
  cacheTag("match-results");
  return matchService.getMatchResults(matchId);
}
