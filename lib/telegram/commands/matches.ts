import { getMatchesByMonth } from "@/app/actions/match-actions";
import { sendMessage } from "../utils";
import { Match } from "@/lib/types/match";
import { getMonthByDate, getMonthsBySeason } from "@/app/actions/month-actions";
import { getAllSeasons } from "@/app/actions/season-actions";
import { resolveSeasonId } from "@/lib/liga/resolve-season";
import { resolveActiveMonth } from "@/lib/liga/resolve-month";

function buildMatchesAnswer(matches: Match[]) {
  const matchesByDay = Object.groupBy(matches, (match) =>
    String(match.matchday),
  );

  let text = "";

  Object.entries(matchesByDay)
    .sort(([a], [b]) => Number(a) - Number(b))
    .forEach(([day, dayMatches]) => {
      text += `Jornada ${day}:\n\n`;

      const categories = Object.groupBy(
        dayMatches!,
        (match) => match.category.name,
      );

      Object.entries(categories).forEach(([category, categoryMatches]) => {
        text += `${category}:\n`;

        categoryMatches!.forEach((match) => {
          const names = match.players.map((p) => p.nickname || p.full_name);
          text += names.join(", ") + "\n";
        });

        text += "\n";
      });

      text += "\n";
    });

  return text.trimEnd();
}

export async function matchesCommand(chatId: number, message: string) {
  const monthInput = message.trim().split(" ")[1];

  let monthId: number | undefined;

  if (!monthInput) {
    const seasons = await getAllSeasons();
    const seasonId = resolveSeasonId([], seasons);
    const months = await getMonthsBySeason(seasonId);

    monthId = resolveActiveMonth(months, {}).currentMonthId;

    if (!monthId) {
      await sendMessage(chatId, "Todavía no se han confirmado los partidos.");
      return;
    }
  } else {
    const match = monthInput.match(/^(\d{2})\/(\d{4})$/);

    if (!match) {
      await sendMessage(
        chatId,
        "Formato inválido. Usa MM/YYYY, por ejemplo: 09/2026.",
      );
      return;
    }

    const month = Number(match[1]);
    const year = Number(match[2]);

    if (month < 1 || month > 12) {
      await sendMessage(chatId, "El mes debe estar entre 01 y 12.");
      return;
    }

    let monthData;
    try {
      monthData = await getMonthByDate(month, year);
    } catch {
      await sendMessage(chatId, "Ha ocurrido un error obteniendo los datos.");
      return;
    }

    if (!monthData) {
      await sendMessage(chatId, "No existe ese mes en la liga.");
      return;
    }

    monthId = monthData.id;
  }

  const matches = await getMatchesByMonth(monthId);

  if (matches.length === 0) {
    await sendMessage(chatId, "No hay partidos confirmados para este mes.");
    return;
  }

  await sendMessage(chatId, buildMatchesAnswer(matches));
}
