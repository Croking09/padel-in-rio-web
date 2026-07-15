import "server-only";

import { matchdayRepository } from "@/server/repositories/matchday-repository";
import { monthRepository } from "@/server/repositories/month-repository";
import { setRepository } from "@/server/repositories/set-repository";
import { matchParticipantRepository } from "@/server/repositories/match-participant-repository";

const MATCHDAYS_PER_MONTH = 2;

export const matchService = {
  async getMatchesByMonth(monthId: number) {
    try {
      const month = await monthRepository.getById(monthId);
      const months = await monthRepository.getBySeason(month.season_id);

      const monthIndex = months.findIndex((m) => m.id === monthId);
      const matchdayOffset =
        monthIndex >= 0 ? monthIndex * MATCHDAYS_PER_MONTH : 0;

      const matchdays = await matchdayRepository.getByMonth(monthId);

      return matchdays.flatMap((matchday) =>
        matchday.matches.map((match) => ({
          id: match.id,
          matchday: matchdayOffset + matchday.order,
          category: match.category,
          players: [...match.match_participants]
            .sort((a, b) => a.id - b.id)
            .map((mp) => mp.player),
        })),
      );
    } catch {
      return [];
    }
  },

  async getMatchesWithResults(matchIds: number[]) {
    try {
      return setRepository.existsBatch(matchIds);
    } catch {
      return [];
    }
  },

  async getMatchResults(matchId: number) {
    try {
      const sets = await setRepository.getByMatch(matchId);
      const participation =
        await matchParticipantRepository.getByMatch(matchId);

      const absentPlayers = new Set(
        participation
          .filter((p) => p.substitute_id !== null)
          .map((p) => p.player_id),
      );

      const results = sets.map((set) => ({
        ...set,
        player1: {
          ...set.player1,
          isAbsent: absentPlayers.has(set.player1.id),
        },
        player2: {
          ...set.player2,
          isAbsent: absentPlayers.has(set.player2.id),
        },
        player3: {
          ...set.player3,
          isAbsent: absentPlayers.has(set.player3.id),
        },
        player4: {
          ...set.player4,
          isAbsent: absentPlayers.has(set.player4.id),
        },
      }));

      return results;
    } catch {
      return [];
    }
  },
};
