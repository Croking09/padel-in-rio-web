import { renderToBuffer } from "@react-pdf/renderer";
import { MatchesPdf } from "@/lib/pdf/matches-pdf";
import { getMatchesByDayGlobal } from "@/lib/partidos";

export async function generateMatchesPdf(monthId: number) {
  const { matchesByDay } = await getMatchesByDayGlobal(monthId);

  const buffer = await renderToBuffer(
    <MatchesPdf matchesByDay={matchesByDay} />,
  );

  return buffer;
}
