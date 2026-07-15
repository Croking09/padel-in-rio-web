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
};
