import { getConfirmedMatches } from "@/app/actions/partidos";
import { getMonths } from "@/app/actions/monthly-assignment";
import { Match } from "@/lib/types/match";

export async function getMatchesByDayGlobal(monthInput?: string | number) {
  const allMonths = await getMonths();
  const confirmedMonths = allMonths.filter((m) => m.status === "confirmed");

  if (confirmedMonths.length === 0)
    return { matchesByDay: {}, monthId: undefined };

  const orderedConfirmedMonths = [...confirmedMonths].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  let currentMonthId: number | undefined;

  if (typeof monthInput === "string") {
    const [mm, yyyy] = monthInput.split("/").map(Number);
    if (!isNaN(mm) && !isNaN(yyyy)) {
      const matchedMonth = confirmedMonths.find(
        (m) => m.month === mm && m.year === yyyy,
      );
      currentMonthId = matchedMonth?.id;
    }
  } else if (typeof monthInput === "number") {
    currentMonthId = monthInput;
  }

  if (!currentMonthId) {
    const lastConfirmedMonth =
      orderedConfirmedMonths[orderedConfirmedMonths.length - 1];
    currentMonthId = lastConfirmedMonth.id;
  }

  const matches = await getConfirmedMatches(currentMonthId);

  const monthIndex = orderedConfirmedMonths.findIndex(
    (m) => m.id === currentMonthId,
  );
  const jornadaOffset = monthIndex >= 0 ? monthIndex * 2 : 0;

  const matchesByDay: Record<number, Record<string, Match[]>> = {};

  matches.forEach((match) => {
    const globalDay = jornadaOffset + match.matchday;

    if (!matchesByDay[globalDay]) matchesByDay[globalDay] = {};
    if (!matchesByDay[globalDay][match.categoryName])
      matchesByDay[globalDay][match.categoryName] = [];

    matchesByDay[globalDay][match.categoryName].push(match);
  });

  return { matchesByDay, monthId: currentMonthId };
}
