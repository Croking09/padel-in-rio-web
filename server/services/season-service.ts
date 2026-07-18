import "server-only";

import { seasonRepository } from "@/server/repositories/season-repository";
import { CreateSeasonInput } from "@/lib/types/season";
import { isPgError } from "@/lib/errors";

export const seasonService = {
  async getCount() {
    return seasonRepository.count();
  },

  async getAll() {
    try {
      return seasonRepository.getAll();
    } catch {
      return [];
    }
  },

  async getAllWithMonths() {
    try {
      return seasonRepository.getAllWithMonths();
    } catch {
      return [];
    }
  },

  async create(data: CreateSeasonInput) {
    const { name, months } = data;

    if (!name || name === "") {
      return { success: false as const, error: "Faltan campos obligatorios." };
    }

    if (!months || months.length === 0) {
      return {
        success: false as const,
        error: "Debe haber por lo menos un mes en la temporada.",
      };
    }

    try {
      await seasonRepository.insert(data);
    } catch (error) {
      if (isPgError(error, "42501")) {
        return {
          success: false as const,
          error: "No estás autorizado a crear temporadas.",
        };
      }
      return {
        success: false as const,
        error: "Error al crear la temporada.",
      };
    }

    return { success: true as const };
  },
};
