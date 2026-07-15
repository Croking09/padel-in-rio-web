"use server";

import { RegisterMatchParticipant } from "@/lib/types/match-participant";
import { SetInsert } from "@/lib/types/set";
import { matchService } from "@/server/services/match-service";
import { cacheLife, cacheTag, updateTag } from "next/cache";

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
  cacheTag("match-results");
  return matchService.getMatchesWithResults(matchIds);
}

export async function getMatchResults(matchId: number) {
  "use cache";
  cacheLife("days");
  cacheTag("match-results");
  return matchService.getMatchResults(matchId);
}

export async function getMatchParticipants(matchId: number) {
  "use cache";
  cacheLife("days");
  cacheTag("match-participants");
  return matchService.getParticipantsByMatch(matchId);
}

export async function registerMatchResults(
  matchId: number,
  sets: SetInsert[],
  participants: RegisterMatchParticipant[],
) {
  const result = await matchService.registerResults(
    matchId,
    sets,
    participants,
  );

  if (result.success) {
    updateTag("match-results");
    updateTag("match-participants");
    updateTag("classification");
  }

  return result;
}
