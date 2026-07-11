import { renderToBuffer } from "@react-pdf/renderer";
import { MatchesPdf } from "@/lib/pdf/matches-pdf";
import { getMatchesByDayGlobal } from "@/lib/liga/partidos";

export async function generateMatchesPdf(monthId: number, temporadaId: number) {
  const { matchesByDay } = await getMatchesByDayGlobal(monthId, temporadaId);

  const buffer = await renderToBuffer(
    <MatchesPdf matchesByDay={matchesByDay} />,
  );

  return buffer;
}
