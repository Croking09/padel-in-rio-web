import { getMonths } from "@/app/actions/ligas";
import { getConfirmedMatches } from "@/app/actions/partidos";
import { Match } from "@/lib/types/match";
import { MonthStatus } from "./types/month";

export async function getMatchesByDayGlobal(
  monthInput: string | number,
  temporadaId?: number,
) {
  const allMonths = await getMonths();

  const confirmedMonths = allMonths.filter(
    (m) =>
      m.status === MonthStatus.Confirmed &&
      (temporadaId ? m.temporada_id === temporadaId : true),
  );

  if (confirmedMonths.length === 0) {
    return { matchesByDay: {}, monthId: undefined };
  }

  const orderedConfirmedMonths = [...confirmedMonths].sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month,
  );

  let currentMonthId: number | undefined;

  if (typeof monthInput === "string") {
    const [mm, yyyy] = monthInput.split("/").map(Number);

    if (!isNaN(mm) && !isNaN(yyyy)) {
      const matchedMonth = allMonths.find(
        (m) => m.month === mm && m.year === yyyy,
      );

      currentMonthId = matchedMonth?.id;
    }
  } else if (typeof monthInput === "number") {
    currentMonthId = monthInput;
  }

  if (!currentMonthId) {
    currentMonthId = orderedConfirmedMonths.at(-1)?.id;
  }

  if (!currentMonthId) {
    return { matchesByDay: {}, monthId: undefined };
  }

  const matches = await getConfirmedMatches(currentMonthId);

  const monthIndex = orderedConfirmedMonths.findIndex(
    (m) => m.id === currentMonthId,
  );

  const JOURNALS_PER_MONTH = 2;

  const jornadaOffset = monthIndex >= 0 ? monthIndex * JOURNALS_PER_MONTH : 0;

  const matchesByDay: Record<number, Record<string, Match[]>> = {};

  matches.forEach((match) => {
    const globalDay = jornadaOffset + match.matchday;

    if (!matchesByDay[globalDay]) {
      matchesByDay[globalDay] = {};
    }

    if (!matchesByDay[globalDay][match.categoryName]) {
      matchesByDay[globalDay][match.categoryName] = [];
    }

    matchesByDay[globalDay][match.categoryName].push(match);
  });

  Object.keys(matchesByDay).forEach((day) => {
    matchesByDay[Number(day)] = Object.fromEntries(
      Object.entries(matchesByDay[Number(day)]).sort(([a], [b]) =>
        a.localeCompare(b, "es", { numeric: true }),
      ),
    );
  });

  return {
    matchesByDay,
    monthId: currentMonthId,
  };
}
