import { MatchParticipantWithPlayer } from "@/lib/types/match-participant";

export function getMatchSetCombos(players: MatchParticipantWithPlayer[]) {
  if (players.length !== 4) return [];

  const [player1, player2, player3, player4] = players;

  return [
    [player1, player2, player3, player4],
    [player1, player3, player2, player4],
    [player1, player4, player2, player3],
  ];
}
