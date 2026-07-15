import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Match } from "@/lib/types/match";
import { MemberRow } from "@/lib/types/member";
import { MonthRow } from "@/lib/types/month";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(string: string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function generateCategoryMatches(
  categoryId: number,
  categoryName: string,
  players: MemberRow[],
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

export function getCurrentMonthId(months: MonthRow[]) {
  if (!months.length) return undefined;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return months.find((m) => m.year === currentYear && m.month === currentMonth)
    ?.id;
}
