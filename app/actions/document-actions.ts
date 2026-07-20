"use server";

import { documentService } from "@/server/services/document-service";
import { cacheLife } from "next/cache";

export async function getLeagueRules(seasonId: number) {
  "use cache";
  cacheLife("max");
  return documentService.getLeagueRules(seasonId);
}

export async function getCookiePolicy() {
  "use cache";
  cacheLife("max");
  return documentService.getCookiePolicy();
}
