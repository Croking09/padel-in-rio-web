import { renderToStream } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { MatchesPdf } from "@/lib/pdf/matches-pdf";
import { previewMonth } from "@/app/actions/generador-partidos";
import { Match } from "@/lib/types/match";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const monthId = Number(searchParams.get("monthId"));

  const matches = await previewMonth(monthId);

  const matchesByDay: Record<number, Record<string, Match[]>> = {};

  matches.forEach((match) => {
    if (!matchesByDay[match.matchday]) {
      matchesByDay[match.matchday] = {};
    }
    if (!matchesByDay[match.matchday][match.categoryName]) {
      matchesByDay[match.matchday][match.categoryName] = [];
    }
    matchesByDay[match.matchday][match.categoryName].push(match);
  });

  const stream = await renderToStream(
    <MatchesPdf matchesByDay={matchesByDay} />,
  );

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
