"use server";

import { monthService } from "@/server/services/month-service";
import { cacheLife, cacheTag } from "next/cache";

export async function getMonthsBySeason(seasonId: number) {
  "use cache";
  cacheLife("days");
  cacheTag("months");
  return monthService.getBySeason(seasonId);
}

export async function getMonthByDate(month: number, year: number) {
  "use cache";
  cacheLife("days");
  cacheTag("months");
  return monthService.getByMonthAndYear(month, year);
}
