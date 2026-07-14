"use server";

import { CreateSeasonInput } from "@/lib/types/season";
import { seasonService } from "@/server/services/season-service";
import { cacheLife, cacheTag, updateTag } from "next/cache";

export async function getSeasonsCount() {
  "use cache";
  cacheLife("days");
  cacheTag("season-count");
  return seasonService.getCount();
}

export async function getAllSeasons() {
  "use cache";
  cacheLife("days");
  cacheTag("seasons");
  return seasonService.getAll();
}

export async function getAllSeasonsWithMonths() {
  "use cache";
  cacheLife("days");
  cacheTag("seasons");
  return seasonService.getAllWithMonths();
}

export async function createSeason(data: CreateSeasonInput) {
  const result = await seasonService.create(data);

  if (result.success) {
    updateTag("season-count");
    updateTag("seasons");
  }
  return result;
}
