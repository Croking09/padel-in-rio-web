import "server-only";

import { categoryRepository } from "@/server/repositories/category-repository";
import { memberRepository } from "@/server/repositories/member-repository";
import { monthRepository } from "@/server/repositories/month-repository";
import { playerAssignmentRepository } from "@/server/repositories/player-assignment-repository";
import { isPgError } from "@/lib/errors";

export const playerAssignmentService = {
  async getAssignmentData(monthId: number) {
    const [month, categories, players, rawAssignments] = await Promise.all([
      monthRepository.getById(monthId),
      categoryRepository.getAll(),
      memberRepository.findAll(true),
      playerAssignmentRepository.getByMonth(monthId),
    ]);

    const assignments = rawAssignments.map((assignment) => ({
      id: assignment.id,
      category_id: assignment.category_id,
      player_id: assignment.player.id,
      month_id: monthId,
    }));

    return {
      categories,
      players,
      assignments,
      status: month.status,
      useFifthCategory: month.has_fifth_category,
    };
  },

  async saveAssignments(
    monthId: number,
    assignments: { player_id: number; category_id: number }[],
  ) {
    try {
      await playerAssignmentRepository.saveForMonth(monthId, assignments);
    } catch (error) {
      if (isPgError(error, "42501")) {
        return {
          success: false as const,
          error: "No tienes permiso para guardar las asignaciones.",
        };
      }
      return {
        success: false as const,
        error: "Error al guardar las asignaciones.",
      };
    }

    return { success: true as const };
  },

  async confirmMonth(monthId: number) {
    try {
      await monthRepository.update(monthId, { status: "locked" });
    } catch (error) {
      if (isPgError(error, "42501")) {
        return {
          success: false as const,
          error: "No tienes permiso para actualizar el estado.",
        };
      }
      return {
        success: false as const,
        error: "Error al confirmar el mes.",
      };
    }

    return { success: true as const };
  },
};
