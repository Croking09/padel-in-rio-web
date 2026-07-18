import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MonthRow } from "@/lib/types/month";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(string: string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getCurrentMonthId(months: MonthRow[]) {
  if (!months.length) return undefined;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return months.find((m) => m.year === currentYear && m.month === currentMonth)
    ?.id;
}
