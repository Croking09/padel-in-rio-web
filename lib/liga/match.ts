import { CategoryRow } from "@/lib/types/category";
import { GeneratedMatch } from "@/lib/types/match";
import { Player } from "@/lib/types/member";

export function getMatchSetCombos(players: Player[]) {
  if (players.length !== 4) return [];

  const [player1, player2, player3, player4] = players;

  return [
    [player1, player2, player3, player4],
    [player1, player3, player2, player4],
    [player1, player4, player2, player3],
  ];
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function generateFourPlayerCategoryMatches(
  category: CategoryRow,
  shuffled: Player[],
): GeneratedMatch[] {
  if (shuffled.length % 4 !== 0) {
    throw new Error("El número de jugadores debe ser múltiplo de 4");
  }

  const matchday1 = chunk(shuffled, 4).map((players) => ({
    category,
    matchday: 1,
    players,
  }));

  const half = shuffled.length / 2;
  const rotated = [...shuffled.slice(half), ...shuffled.slice(0, half)];

  const matchday2 = chunk(rotated, 4).map((players) => ({
    category,
    matchday: 2,
    players,
  }));

  return [...matchday1, ...matchday2];
}

function generateEightPlayerCategoryMatches(
  category: CategoryRow,
  shuffled: Player[],
): GeneratedMatch[] {
  if (shuffled.length !== 8) {
    throw new Error(
      `La categoría "${category.name}" requiere exactamente 8 jugadores`,
    );
  }

  const [p0, p1, p2, p3, p4, p5, p6, p7] = shuffled;

  return [
    { category, matchday: 1, players: [p0, p1, p2, p3] },
    { category, matchday: 1, players: [p4, p5, p6, p7] },
    { category, matchday: 2, players: [p0, p1, p4, p5] },
    { category, matchday: 2, players: [p2, p3, p6, p7] },
  ];
}

export function generateCategoryMatches(
  category: CategoryRow,
  players: Player[],
): GeneratedMatch[] {
  const shuffled = [...players].sort(() => Math.random() - 0.5);

  return category.order === 4
    ? generateFourPlayerCategoryMatches(category, shuffled)
    : generateEightPlayerCategoryMatches(category, shuffled);
}
