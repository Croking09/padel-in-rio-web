"use server";

import { TournamentMatchInsert } from "@/lib/types/tournament-match";
import { tournamentMatchService } from "@/server/services/tournament-match-service";

export async function createMatch(input: TournamentMatchInsert) {
  const result = await tournamentMatchService.create(input);

  // if (result.success) {
  //   updateTag()
  // }
  return result;
}
