import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Match } from "@/lib/types/match";
import { Socio } from "./types/socio";
import { Month, MonthStatus } from "./types/month";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  dateString: string,
  format: string = "dd/MM/yyyy",
): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return dateString;
  }

  const tokens: Record<string, string> = {
    dd: date.getDate().toString().padStart(2, "0"),
    MM: (date.getMonth() + 1).toString().padStart(2, "0"),
    yyyy: date.getFullYear().toString(),
    HH: date.getHours().toString().padStart(2, "0"),
    mm: date.getMinutes().toString().padStart(2, "0"),
  };

  let result = format;
  for (const token in tokens) {
    result = result.replace(token, tokens[token]);
  }

  return result;
}

export function formatMonth(month: number) {
  switch (month) {
    case 1:
      return "Enero";
    case 2:
      return "Febrero";
    case 3:
      return "Marzo";
    case 4:
      return "Abril";
    case 5:
      return "Mayo";
    case 6:
      return "Junio";
    case 7:
      return "Julio";
    case 8:
      return "Agosto";
    case 9:
      return "Septiembre";
    case 10:
      return "Octubre";
    case 11:
      return "Noviembre";
    case 12:
      return "Diciembre";
    default:
      return "Mes " + month;
  }
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
