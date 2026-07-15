"use server";

import { CategoryClassification } from "@/lib/types/classification";
import { classificationService } from "@/server/services/classification-service";
import { cacheLife, cacheTag, updateTag } from "next/cache";

export async function hasBonusGiven(monthId: number) {
  "use cache";
  cacheLife("days");
  cacheTag("bonus-exists");
  return classificationService.hasBonusGiven(monthId);
}

export async function giveMonthlyBonus(
  classification: CategoryClassification[],
  monthId: number,
) {
  const result = await classificationService.giveMonthlyBonus(
    classification,
    monthId,
  );

  if (result.success) {
    updateTag("general");
    updateTag("bonus-exists");
  }
  return result;
}

export async function getAscensor(monthId: number) {
  "use cache";
  cacheLife("days");
  cacheTag("ascensor", "classification");
  return classificationService.getAscensor(monthId);
}

export async function getGeneralClassification(seasonId: number) {
  "use cache";
  cacheLife("days");
  cacheTag("general", "classification");
  return classificationService.getGeneralClassification(seasonId);
}
