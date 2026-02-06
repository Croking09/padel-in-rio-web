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
