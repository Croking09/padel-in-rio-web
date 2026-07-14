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
};
