import "server-only";

import { documentRepository } from "@/server/repositories/document-repository";

export const documentService = {
  async getLeagueRules(seasonId: number) {
    try {
      return {
        success: true as const,
        content: await documentRepository.getDocument(
          `league_rules_${seasonId}.md`,
        ),
      };
    } catch {
      return { success: false as const };
    }
  },

  async getCookiePolicy() {
    return documentRepository.getDocument("cookie_policy.md");
  },
};
