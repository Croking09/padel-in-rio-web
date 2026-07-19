"use server";

import { documentService } from "@/server/services/document-service";

export async function getLeagueRules(seasonId: number) {
  return documentService.getLeagueRules(seasonId);
}

export async function getCookiePolicy() {
  return documentService.getCookiePolicy();
}
