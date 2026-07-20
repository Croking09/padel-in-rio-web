import "server-only";

import { tournamentRepository } from "@/server/repositories/tournament-repository";
import type {
  TournamentRow,
  TournamentWithImage,
  CreateTournamentInput,
} from "@/lib/types/tournament";
import { isPgError } from "@/lib/errors";

export const tournamentService = {
  async getCount() {
    return tournamentRepository.count();
  },

  async getAll(): Promise<TournamentWithImage[]> {
    try {
      const data = await tournamentRepository.findAll();
      return data.map((tournament) => ({
        ...tournament,
        imageUrl: tournament.img_path
          ? tournamentRepository.getPublicImageUrl(tournament.img_path)
          : null,
      }));
    } catch {
      return [];
    }
  },

  async getById(id: number): Promise<TournamentRow | null> {
    try {
      return await tournamentRepository.findById(id);
    } catch {
      return null;
    }
  },

  async create(data: CreateTournamentInput) {
    const {
      name,
      description,
      start_date,
      end_date,
      inscription_end_date,
      categories,
      img_path,
    } = data;

    const rollbackImage = async () => {
      if (img_path) await tournamentRepository.removeImage(img_path);
    };

    if (!name || !start_date || !end_date || !inscription_end_date) {
      await rollbackImage();
      return { success: false as const, error: "Faltan campos obligatorios." };
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    const inscriptionEnd = new Date(inscription_end_date);

    if (inscriptionEnd >= start) {
      await rollbackImage();
      return {
        success: false as const,
        error:
          "El cierre de inscripciones debe ser anterior al inicio del torneo.",
      };
    }

    if (start >= end) {
      await rollbackImage();
      return {
        success: false as const,
        error: "La fecha de inicio debe ser anterior a la fecha de fin.",
      };
    }

    try {
      await tournamentRepository.insert({
        name,
        description,
        start_date,
        end_date,
        inscription_end_date,
        img_path,
        categories,
        manually_closed: false,
      });
    } catch (error) {
      await rollbackImage();
      if (isPgError(error, "42501")) {
        return {
          success: false as const,
          error: "No estás autorizado a crear torneos.",
        };
      }
      return {
        success: false as const,
        error: "Error al crear el torneo. Verifica los datos.",
      };
    }

    return { success: true as const };
  },

  async delete(id: number) {
    try {
      await tournamentRepository.deleteById(id);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "42501"
      ) {
        return {
          success: false as const,
          error: "No estás autorizado a eliminar el torneo.",
        };
      }
      return {
        success: false as const,
        error: "Hubo un error al eliminar el torneo.",
      };
    }

    return { success: true as const };
  },
};
