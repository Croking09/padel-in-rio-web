"use server";

import { cacheLife, cacheTag, updateTag } from "next/cache";
import { tournamentService } from "@/server/services/tournament-service";
import type { CreateTournamentInput } from "@/lib/types/tournament";

export async function getTournamentsCount() {
  "use cache";
  cacheLife("days");
  cacheTag("tournament-count");
  return tournamentService.getCount();
}

export async function getTournaments() {
  "use cache";
  cacheLife("days");
  cacheTag("tournaments");
  return tournamentService.getAll();
}

export async function getTournamentById(id: number) {
  "use cache";
  cacheLife("days");
  cacheTag("tournaments");
  return tournamentService.getById(id);
}

export async function createTournament(data: CreateTournamentInput) {
  const result = await tournamentService.create(data);

  if (result.success) {
    updateTag("tournament-count");
    updateTag("tournaments");
  }
  return result;
}

export async function deleteTournament(id: number) {
  const result = await tournamentService.delete(id);
  if (result.success) {
    updateTag("tournament-count");
    updateTag("tournaments");
  }
  return result;
}
