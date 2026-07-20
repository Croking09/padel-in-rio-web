"use server";

import { playerAssignmentService } from "@/server/services/player-assignment-service";
import { cacheLife, cacheTag, updateTag } from "next/cache";

export async function getAssignmentData(monthId: number) {
  "use cache";
  cacheLife("days");
  cacheTag("player-assignment");

  return playerAssignmentService.getAssignmentData(monthId);
}

export async function saveAssignments(
  monthId: number,
  assignments: { player_id: number; category_id: number }[],
) {
  return playerAssignmentService.saveAssignments(monthId, assignments);
}

export async function confirmMonth(monthId: number) {
  const result = await playerAssignmentService.confirmMonth(monthId);

  if (result.success) {
    updateTag("player-assignment");
    updateTag("months");
  }

  return result;
}
