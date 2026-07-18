"use server";

import { GeneratedMatch } from "@/lib/types/match";
import { matchGeneratorService } from "@/server/services/match-generator-service";
import { updateTag } from "next/cache";

export async function previewMonth(monthId: number) {
  return matchGeneratorService.previewMonth(monthId);
}

export async function confirmMonth(monthId: number, matches: GeneratedMatch[]) {
  const result = await matchGeneratorService.confirmMonth(monthId, matches);

  if (result.success) {
    updateTag("match-participants");
    updateTag("months");
  }

  return result;
}
