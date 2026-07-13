import { authRepository } from "@/server/repositories/auth-repository";
import { inscriptionRepository } from "@/server/repositories/inscription-repository";
import { tournamentRepository } from "@/server/repositories/tournament-repository";
import { ADMINS, sendMessage } from "@/lib/telegram/utils";
import { newInscriptionMessage } from "@/lib/telegram/answers";
import type { Database } from "@/lib/database.types";
import { isPgError } from "@/lib/errors";

type InscriptionInsert = Database["public"]["Tables"]["inscriptions"]["Insert"];
export type CreateInscriptionInput = Omit<InscriptionInsert, "id" | "user_id">;

export const inscriptionService = {
  async create(data: CreateInscriptionInput, categoriesNeeded: boolean) {
    const user = await authRepository.getCurrentUserServer();
    if (!user) {
      return { error: "Debes iniciar sesión para inscribirte." };
    }

    const {
      tournament_id,
      phone_number,
      category,
      player1_full_name,
      player2_full_name,
    } = data;

    if (
      !tournament_id ||
      !phone_number ||
      !player1_full_name ||
      !player2_full_name ||
      (categoriesNeeded && !category)
    ) {
      return { success: false as const, error: "Faltan datos requeridos." };
    }

    let tournament;
    try {
      tournament = await tournamentRepository.findMetaById(tournament_id);
    } catch {
      return {
        success: false as const,
        error: "El torneo no existe o ha sido eliminado.",
      };
    }

    if (
      new Date() > new Date(tournament.inscription_end_date) ||
      tournament.manually_closed
    ) {
      return {
        success: false as const,
        error: "El plazo de inscripción se ha cerrado",
      };
    }

    try {
      await inscriptionRepository.insert({
        tournament_id,
        user_id: user.id,
        phone_number,
        category,
        player1_full_name,
        player2_full_name,
      });
    } catch (error) {
      if (isPgError(error, "23505")) {
        return {
          success: false as const,
          error: "Ya estás inscrito en este torneo.",
        };
      }
      if (isPgError(error, "42501")) {
        return {
          success: false as const,
          error: "No estás autorizado a inscribirte.",
        };
      }
      return {
        success: false as const,
        error: "Hubo un error al procesar tu inscripción.",
      };
    }

    const adminMessage = newInscriptionMessage(
      tournament.name,
      player1_full_name,
      player2_full_name,
      phone_number,
      category,
    );

    for (const admin of ADMINS) {
      await sendMessage(admin, adminMessage, { parse_mode: "Markdown" });
    }

    return { success: true as const };
  },

  async getAllForOpenTournaments() {
    try {
      const data = await inscriptionRepository.findAllForOpenTournaments();
      return { data };
    } catch {
      return {
        success: false as const,
        error: "Hubo un error al obtener las inscripciones.",
      };
    }
  },

  async getByTournament(tournamentId: number) {
    try {
      const data = await inscriptionRepository.findByTournamentId(tournamentId);
      return { data, success: true as const };
    } catch {
      return {
        success: false as const,
        error: "Hubo un error al obtener las inscripciones.",
      };
    }
  },

  async toggle(tournamentId: number, shouldClose: boolean) {
    try {
      await tournamentRepository.updateManuallyClosed(
        tournamentId,
        shouldClose,
      );
    } catch (error) {
      if (isPgError(error, "42501")) {
        return {
          success: false as const,
          error: "No estás autorizado a modificar las inscripciones.",
        };
      }
      return {
        success: false as const,
        error: "Hubo un error al modificar las inscripciones.",
      };
    }

    return { success: true as const };
  },

  async getMyOpenTournamentsInscriptions(userId: string) {
    try {
      return await inscriptionRepository.findMyOpenTournamentInscriptions(
        userId,
      );
    } catch {
      return [];
    }
  },
};
