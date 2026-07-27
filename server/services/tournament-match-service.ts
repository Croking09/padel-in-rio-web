import { getTournamentById } from "@/app/actions/tournament-actions";
import { isPgError } from "@/lib/errors";
import {
  TournamentMatchInsert,
  TournamentMatchUpdate,
} from "@/lib/types/tournament-match";
import { tournamentMatchRepository } from "@/server/repositories/tournament-match-repository";
import { endOfDay, isAfter, isBefore, startOfDay } from "date-fns";
import "server-only";

export const tournamentMatchService = {
  async create(input: TournamentMatchInsert) {
    try {
      const tournament = await getTournamentById(input.tournament_id);

      if (!tournament) {
        throw new Error();
      }

      const scheduledDate = new Date(input.scheduled_datetime);

      const startDate = startOfDay(new Date(tournament.start_date));
      const endDate = endOfDay(new Date(tournament.end_date));

      if (
        isBefore(scheduledDate, startDate) ||
        isAfter(scheduledDate, endDate)
      ) {
        return {
          success: false as const,
          error: "La fecha y hora debe estar dentro de las fechas del torneo.",
        };
      }

      await tournamentMatchRepository.insert(input);
    } catch (error) {
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

  async getByTournament(tournamentId: number) {
    try {
      return tournamentMatchRepository.getByTournament(tournamentId);
    } catch {
      return [];
    }
  },

  async update(
    matchId: number,
    tournamentId: number,
    input: TournamentMatchUpdate,
  ) {
    try {
      const tournament = await getTournamentById(tournamentId);

      if (!tournament) {
        throw new Error();
      }

      if (input.scheduled_datetime) {
        const scheduledDate = new Date(input.scheduled_datetime);

        const startDate = startOfDay(new Date(tournament.start_date));
        const endDate = endOfDay(new Date(tournament.end_date));

        if (
          isBefore(scheduledDate, startDate) ||
          isAfter(scheduledDate, endDate)
        ) {
          return {
            success: false as const,
            error:
              "La fecha y hora debe estar dentro de las fechas del torneo.",
          };
        }
      }

      await tournamentMatchRepository.update(matchId, input);
    } catch (error) {
      if (isPgError(error, "42501")) {
        return {
          success: false as const,
          error: "No estás autorizado a editar partidos.",
        };
      }

      return {
        success: false as const,
        error: "Ha ocurrido un error editando el partido.",
      };
    }

    return { success: true as const };
  },
};
