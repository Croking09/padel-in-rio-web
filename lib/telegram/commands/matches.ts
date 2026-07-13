import { getMonths } from "@/app/actions/ligas";
import { sendMessage } from "../utils";
import { getMatchesByDayGlobal } from "@/lib/liga/partidos";
import { MonthStatus } from "@/lib/types/month";
import { Match } from "@/lib/types/match";

function buildMatchesAnswer(
  matchesByDay: Record<number, Record<string, Match[]>>,
) {
  let text = "";

  Object.entries(matchesByDay).forEach(([day, categories]) => {
    text += `Jornada ${day}:\n\n`;

    Object.entries(categories).forEach(([category, categoryMatches]) => {
      text += `${category}:\n`;
      categoryMatches.forEach((match) => {
        const names = match.players.map((p) => p.nickname || p.full_name);
        text += names.join(", ") + "\n";
      });
      text += "\n";
    });

    text += "\n";
  });

  return text;
}

export async function matchesCommand(chatId: number, message: string) {
  const monthInput = message.trim().split(" ")[1];

  const allMonths = await getMonths();

  let temporadaId: number | undefined;

  if (monthInput) {
    const [mm, yyyy] = monthInput.split("/").map(Number);

    const matched = allMonths.find((m) => m.month === mm && m.year === yyyy);

    temporadaId = matched?.temporada_id;
  }

  // Si no se indica mes o no existe, usar el último confirmado
  if (!temporadaId) {
    const lastConfirmed = allMonths
      .filter((m) => m.status === MonthStatus.Confirmed)
      .sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month))
      .at(-1);

    temporadaId = lastConfirmed?.temporada_id;
  }

  const { matchesByDay } = await getMatchesByDayGlobal(monthInput, temporadaId);

  if (!matchesByDay || Object.keys(matchesByDay).length === 0) {
    await sendMessage(chatId, "No hay partidos confirmados para este mes.");
    return;
  }

  await sendMessage(chatId, buildMatchesAnswer(matchesByDay));
}
