import { isPgError } from "@/lib/errors";
import { MonthUpdate } from "@/lib/types/month";
import { monthRepository } from "@/server/repositories/month-repository";
import "server-only";

export const monthService = {
  async getBySeason(seasonId: number) {
    try {
      return monthRepository.getBySeason(seasonId);
    } catch {
      return [];
    }
  },

  async getByMonthAndYear(month: number, year: number) {
    return monthRepository.getByMonthAndYear(month, year);
  },

  async updateUseFithCategory(monthId: number, useFifthCategory: boolean) {
    try {
      await monthRepository.update(monthId, {
        has_fifth_category: useFifthCategory,
      } as MonthUpdate);
    } catch (error) {
      if (isPgError(error, "42501")) {
        return {
          success: false as const,
          error: "No tienes permiso para actualizar el mes",
        };
      }
      return {
        success: false as const,
        error: "Error al actualizar el mes.",
      };
    }

    return { success: true as const };
  },
};
