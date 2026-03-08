import { renderToBuffer } from "@react-pdf/renderer";
import { MatchesPdf } from "@/lib/pdf/matches-pdf";
import { getConfirmedMatches } from "@/app/actions/partidos";
import { getMonths } from "@/app/actions/monthly-assignment";
import { Match } from "@/lib/types/match";

export async function generateMatchesPdf(monthId: number) {
  const allMonths = await getMonths();
  const confirmedMonths = allMonths.filter((m) => m.status === "confirmed");

  const orderedConfirmedMonths = [...confirmedMonths].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  const matches = await getConfirmedMatches(monthId);

  const monthIndex = orderedConfirmedMonths.findIndex((m) => m.id === monthId);
  const jornadaOffset = monthIndex >= 0 ? monthIndex * 2 : 0;

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

  const buffer = await renderToBuffer(
    <MatchesPdf matchesByDay={matchesByDay} />,
  );

  return buffer;
}
