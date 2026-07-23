"use server";

import { TournamentMatchInsert } from "@/lib/types/tournament-match";
import { tournamentMatchService } from "@/server/services/tournament-match-service";
import { cacheLife, cacheTag, updateTag } from "next/cache";

export async function createMatch(input: TournamentMatchInsert) {
  const result = await tournamentMatchService.create(input);

  if (result.success) {
    updateTag("tournament-matches");
  }
  return result;
}

export async function getMatchesByTournament(tournamentId: number) {
  "use cache";
  cacheLife("days");
  cacheTag("tournament-matches");
  return tournamentMatchService.getByTournament(tournamentId);
}
