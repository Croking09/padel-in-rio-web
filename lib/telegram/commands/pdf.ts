import { getMonths } from "@/app/actions/ligas";
import { generateMatchesPdf } from "@/lib/pdf/generate-pdf";
import { requireAdmin } from "@/lib/telegram/commands/require-admin";
import { sendDocument, sendMessage } from "@/lib/telegram/utils";
import { MonthStatus } from "@/lib/types/month";

export async function pdfCommand(chatId: number) {
  if (!(await requireAdmin(chatId))) {
    return;
  }

  const allMonths = await getMonths();

  const lastConfirmedMonth = allMonths
    .filter((m) => m.status === MonthStatus.Confirmed)
    .sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month))
    .at(-1);

  if (!lastConfirmedMonth) {
    await sendMessage(chatId, "Todavía no se han confirmado los partidos.");
    return;
  }

  const pdfBuffer = await generateMatchesPdf(
    lastConfirmedMonth.id,
    lastConfirmedMonth.temporada_id,
  );

  await sendDocument(
    chatId,
    pdfBuffer,
    `partidos_${lastConfirmedMonth.year}_${String(lastConfirmedMonth.month).padStart(2, "0")}.pdf`,
  );
}
