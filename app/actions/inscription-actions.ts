"use server";

import { cacheLife, cacheTag, updateTag } from "next/cache";
import { inscriptionService } from "@/server/services/inscription-service";
import type { CreateInscriptionInput } from "@/server/services/inscription-service";

export async function registerToTournament(
  data: CreateInscriptionInput,
  categoriesNeeded: boolean,
) {
  const result = await inscriptionService.create(data, categoriesNeeded);
  if (result.success) updateTag("inscriptions");
  return result;
}

export async function getAllInscriptionsForOpenTournaments() {
  return inscriptionService.getAllForOpenTournaments();
}

export async function getInscriptionsByTournament(tournamentId: number) {
  "use cache";
  cacheLife("days");
  cacheTag("inscriptions");
  return inscriptionService.getByTournament(tournamentId);
}

export async function toggleInscriptions(
  tournamentId: number,
  shouldClose: boolean,
) {
  const result = await inscriptionService.toggle(tournamentId, shouldClose);
  if (result.success) {
    updateTag("tournaments");
    updateTag("inscriptions");
  }
  return result;
}

export async function getMyOpenTournamentsInscriptions(userId: string) {
  return inscriptionService.getMyOpenTournamentsInscriptions(userId);
}
