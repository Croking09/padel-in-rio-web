import { isPgError } from "@/lib/errors";
import { generateCategoryMatches } from "@/lib/liga/match";
import { GeneratedMatch, GenerateMatchesPayload } from "@/lib/types/match";
import { Player } from "@/lib/types/member";
import { categoryRepository } from "@/server/repositories/category-repository";
import { matchRespository } from "@/server/repositories/match-repository";
import { monthRepository } from "@/server/repositories/month-repository";
import { playerAssignmentRepository } from "@/server/repositories/player-assignment-repository";
import "server-only";

export const matchGeneratorService = {
  async previewMonth(monthId: number) {
    const [month, categories, assignments] = await Promise.all([
      monthRepository.getById(monthId),
      categoryRepository.getAll(),
      playerAssignmentRepository.getByMonth(monthId),
    ]);

    const showFifthCategory = month.has_fifth_category ?? false;

    const filteredCategories = categories.filter(
      (cat) => showFifthCategory || cat.name !== "5ª",
    );

    const playersByCategory = new Map<number, Player[]>();
    for (const assignment of assignments) {
      const list = playersByCategory.get(assignment.category_id) ?? [];
      list.push(assignment.player);
      playersByCategory.set(assignment.category_id, list);
    }

    return filteredCategories.flatMap((category) =>
      generateCategoryMatches(
        category,
        playersByCategory.get(category.id) ?? [],
      ),
    );
  },

  async confirmMonth(
    monthId: number,
    matches: GeneratedMatch[],
  ): Promise<{ success: true } | { success: false; error: string }> {
    if (matches.length === 0) {
      return { success: false, error: "No hay partidos para confirmar." };
    }

    const payload: GenerateMatchesPayload[] = matches.map((m) => ({
      category_id: m.category.id,
      matchday: m.matchday,
      players: m.players.map((p) => p.id),
    }));

    try {
      await matchRespository.generateForMonth(monthId, payload);
    } catch (error) {
      if (isPgError(error, "42501")) {
        return {
          success: false as const,
          error: "No estás autorizado a registrar partidos.",
        };
      }
      return {
        success: false as const,
        error: "Error al registrar los partidos.",
      };
    }

    return { success: true as const };
  },
};
