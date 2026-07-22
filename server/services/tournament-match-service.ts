import { isPgError } from "@/lib/errors";
import { TournamentMatchInsert } from "@/lib/types/tournament-match";
import { tournamentMatchRepository } from "@/server/repositories/tournament-match-repository";
import "server-only";

export const tournamentMatchService = {
  async create(input: TournamentMatchInsert) {
    try {
      await tournamentMatchRepository.insert(input);
    } catch (error) {
      console.log(error);
      if (isPgError(error, "42501")) {
        return {
          success: false as const,
          error: "No estás autorizado a crear partidos.",
        };
      }

      return {
        success: false as const,
        error: "Ha ocurrido un error creando el partido.",
      };
    }

    return { success: true as const };
  },
};
