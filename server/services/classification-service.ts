import "server-only";

import { bonusRepository } from "@/server/repositories/bonus-repository";
import { classificationRepository } from "@/server/repositories/classification-repository";
import { CategoryClassification } from "@/lib/types/classification";
import { BonusInsert } from "@/lib/types/bonus";
import { isPgError } from "@/lib/errors";

export const classificationService = {
  async hasBonusGiven(monthId: number) {
    return bonusRepository.existsByMonth(monthId);
  },

  async giveMonthlyBonus(
    classification: CategoryClassification[],
    monthId: number,
  ) {
    let alreadyGiven: boolean;

    try {
      alreadyGiven = await bonusRepository.existsByMonth(monthId);
    } catch {
      return {
        success: false as const,
        error: "No se pudo comprobar si el bonus ya fue aplicado.",
      };
    }

    if (alreadyGiven) {
      return {
        success: false as const,
        error: "El bonus ya ha sido aplicado para este mes.",
      };
    }

    const bonuses: BonusInsert[] = classification
      .filter((categoryBlock) => categoryBlock.category.order !== 1)
      .flatMap((categoryBlock) =>
        categoryBlock.classification.slice(0, 3).map((player) => ({
          player_id: player.player_id,
          quantity: 2,
          month_id: monthId,
        })),
      );

    if (bonuses.length === 0) {
      return {
        success: false as const,
        error: "No hay jugadores elegibles para el bonus.",
      };
    }

    try {
      await bonusRepository.insertBulk(bonuses);
    } catch (error) {
      if (isPgError(error, "42501")) {
        return {
          success: false as const,
          error: "No estás autorizado a aplicar bonus.",
        };
      }
      return {
        success: false as const,
        error: "Error al aplicar el bonus.",
      };
    }

    return { success: true as const };
  },

  async getAscensor(monthId: number) {
    try {
      const rows = await classificationRepository.getAscensor(monthId);

      const byCategory = new Map<number, CategoryClassification>();

      for (const row of rows) {
        let entry = byCategory.get(row.category_id);
        if (!entry) {
          entry = {
            category: {
              id: row.category_id,
              name: row.category_name,
              order: row.category_order,
            },
            classification: [],
          };
          byCategory.set(row.category_id, entry);
        }

        entry.classification.push({
          player_id: row.player_id,
          full_name: row.full_name,
          nickname: row.nickname,
          points: row.points,
          diff: row.diff,
          games_for: row.games_for,
          matches_played: row.matches_played,
        });
      }

      return [...byCategory.values()].sort(
        (a, b) => a.category.order - b.category.order,
      );
    } catch {
      return [];
    }
  },

  async getGeneralClassification(seasonId: number) {
    try {
      return classificationRepository.getGeneral(seasonId);
    } catch {
      return [];
    }
  },
};
