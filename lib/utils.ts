import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Match } from "@/lib/types/match";
import { Socio } from "./types/socio";
import { Month, MonthStatus } from "./types/month";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateCategoryMatches(
  categoryId: number,
  categoryName: string,
  players: Socio[],
): Match[] {
  const shuffled = [...players].sort(() => Math.random() - 0.5);

  if (categoryId === 4) {
    const n = shuffled.length;

    if (n % 4 !== 0) {
      throw new Error("El número de jugadores debe ser múltiplo de 4");
    }

    const matches: Match[] = [];
    const numGroups = n / 4;

    // 🟢 Jornada 1
    for (let i = 0; i < numGroups; i++) {
      matches.push({
        categoryId,
        categoryName,
        matchday: 1,
        players: shuffled.slice(i * 4, i * 4 + 4),
      });
    }

    // 🟢 Jornada 2 (rotación simple)
    const rotated = [...shuffled.slice(n / 2), ...shuffled.slice(0, n / 2)];

    for (let i = 0; i < numGroups; i++) {
      matches.push({
        categoryId,
        categoryName,
        matchday: 2,
        players: rotated.slice(i * 4, i * 4 + 4),
      });
    }

    return matches;
  }

  // resto igual
  const j = shuffled;

  return [
    { categoryId, categoryName, matchday: 1, players: j.slice(0, 4) },
    { categoryId, categoryName, matchday: 1, players: j.slice(4, 8) },
    {
      categoryId,
      categoryName,
      matchday: 2,
      players: [j[0], j[1], j[4], j[5]],
    },
    {
      categoryId,
      categoryName,
      matchday: 2,
      players: [j[2], j[3], j[6], j[7]],
    },
  ];
}

export type MatchSetCombo<T> = [T, T, T, T];

export function getMatchSetCombos<T>(
  players: readonly T[],
): MatchSetCombo<T>[] {
  if (players.length !== 4) return [];

  const [player1, player2, player3, player4] = players;

  return [
    [player1, player2, player3, player4],
    [player1, player3, player2, player4],
    [player1, player4, player2, player3],
  ];
}

export function getCurrentMonthId(months: Month[]) {
  if (!months.length) return undefined;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return months.find((m) => m.year === currentYear && m.month === currentMonth)
    ?.id;
}

export function mapMonthStatus(status: string): MonthStatus {
  switch (status) {
    case MonthStatus.Draft:
    case MonthStatus.Locked:
    case MonthStatus.Confirmed:
      return status;
    default:
      throw new Error(`Invalid month status: ${status}`);
  }
}
