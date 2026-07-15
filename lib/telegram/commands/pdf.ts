import { getMonthsBySeason } from "@/app/actions/month-actions";
import { getAllSeasons } from "@/app/actions/season-actions";
import { resolveActiveMonth } from "@/lib/liga/resolve-month";
import { resolveSeasonId } from "@/lib/liga/resolve-season";
import { generateMatchesPdf } from "@/lib/pdf/generate-pdf";
import { requireAdmin } from "@/lib/telegram/commands/require-admin";
import { sendDocument, sendMessage } from "@/lib/telegram/utils";

export async function pdfCommand(chatId: number) {
  if (!(await requireAdmin(chatId))) {
    return;
  }

  const seasons = await getAllSeasons();
  const seasonId = resolveSeasonId([], seasons);
  const months = await getMonthsBySeason(seasonId);

  const { currentMonthId } = resolveActiveMonth(months, {});

  if (!currentMonthId) {
    await sendMessage(chatId, "Todavía no se han confirmado los partidos.");
    return;
  }

  const pdfBuffer = await generateMatchesPdf(currentMonthId);

  await sendDocument(
    chatId,
    pdfBuffer,
    `partidos_${String(currentMonthId)}.pdf`,
  );
}
