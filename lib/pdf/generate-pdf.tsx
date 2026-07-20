import { renderToBuffer } from "@react-pdf/renderer";
import { MatchesPdf } from "@/lib/pdf/matches-pdf";
import { getMatchesByMonth } from "@/app/actions/match-actions";

export async function generateMatchesPdf(monthId: number) {
  const matches = await getMatchesByMonth(monthId);

  const buffer = await renderToBuffer(<MatchesPdf matches={matches} />);

  return buffer;
}
