import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export type Player = {
  id: string;
  name: string;
};

export type Match = {
  categoryId: string;
  categoryName: string;
  matchday: number;
  players: Player[];
};

export function generateCategoryMatches(
  categoryId: string,
  categoryName: string,
  players: Player[],
): Match[] {
  const j = [...players].sort(() => Math.random() - 0.5);

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
