import { NextRequest, NextResponse } from "next/server";
import { getAllInscripcionesForOpenTorneos } from "@/app/actions/inscripciones";
import {
  default_answer,
  start_answer,
  help_answer,
  formatInscripciones,
  buildMatchesAnswer,
} from "@/lib/telegram/answers";
import {
  sendMessage,
  TELEGRAM_API,
  ADMINS,
  sendDocument,
} from "@/lib/telegram/utils";
import { generateMatchesPdf } from "@/lib/pdf/generate-pdf";
import { getMatchesByDayGlobal } from "@/lib/partidos";
import { MonthStatus } from "@/lib/types/month";
import { getMonths } from "../actions/ligas";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const message = body.message;
  const callback = body.callback_query;

  if (callback) {
    const chatId = callback.message.chat.id;
    const data = callback.data;

    if (data === "help") {
      await sendMessage(chatId, help_answer);
    }

    await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callback.id,
        text: "👍",
      }),
    });

    return NextResponse.json({ ok: true });
  }

  if (message) {
    const chatId = message.chat.id;
    const text = message.text?.trim() || "";

    switch (true) {
      case text === "/start":
        await sendMessage(chatId, start_answer);
        break;

      case text === "/help":
        await sendMessage(chatId, help_answer, {
          reply_markup: {
            inline_keyboard: [],
          },
        });
        break;

      case text === "/inscripciones":
        if (!ADMINS.has(chatId)) {
          await sendMessage(chatId, "No tienes permiso para usar este comando");
          break;
        }

        const { data: inscripciones, error } =
          await getAllInscripcionesForOpenTorneos();

        if (error) {
          await sendMessage(chatId, "❌ Error al obtener las inscripciones.");
        } else if (!inscripciones || inscripciones.length === 0) {
          await sendMessage(chatId, "No hay inscripciones actualmente.");
        } else {
          const formattedMessage = formatInscripciones(inscripciones);
          await sendMessage(chatId, formattedMessage, {
            parse_mode: "Markdown",
          });
        }
        break;

      case text.startsWith("/pdf"):
        if (!ADMINS.has(chatId)) {
          await sendMessage(chatId, "No tienes permiso para usar este comando");
          break;
        }

        const now = new Date();
        const currentMonthNumber = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        const allMonths = await getMonths();
        const currentMonth = allMonths.find(
          (m) =>
            m.month === currentMonthNumber &&
            m.year === currentYear &&
            m.status === MonthStatus.Confirmed,
        );

        if (!currentMonth) {
          await sendMessage(
            chatId,
            "Todavía no se han confirmado los partidos.",
          );
          break;
        }

        const pdfBuffer = await generateMatchesPdf(
          currentMonth.id,
          currentMonth.temporada_id,
        );

        await sendDocument(
          chatId,
          pdfBuffer,
          `partidos_${currentMonthNumber}.pdf`,
        );
        break;
      case text.startsWith("/partidos"):
        const monthInput = text.split(" ")[1];

        const allMonthsForPartidos = await getMonths();

        let temporadaIdForPartidos: number | undefined;

        if (monthInput) {
          const [mm, yyyy] = monthInput.split("/").map(Number);
          const matched = allMonthsForPartidos.find(
            (m) => m.month === mm && m.year === yyyy,
          );
          temporadaIdForPartidos = matched?.temporada_id;
        }

        // Fallback: temporada del último mes confirmado
        if (!temporadaIdForPartidos) {
          const lastConfirmed = allMonthsForPartidos
            .filter((m) => m.status === MonthStatus.Confirmed)
            .sort((a, b) =>
              a.year !== b.year ? a.year - b.year : a.month - b.month,
            )
            .at(-1);
          temporadaIdForPartidos = lastConfirmed?.temporada_id;
        }

        const { matchesByDay } = await getMatchesByDayGlobal(
          monthInput,
          temporadaIdForPartidos,
        );

        if (!matchesByDay || Object.keys(matchesByDay).length === 0) {
          await sendMessage(
            chatId,
            "No hay partidos confirmados para este mes.",
          );
          break;
        }

        const answer = buildMatchesAnswer(matchesByDay);
        await sendMessage(chatId, answer);
        break;
      default:
        await sendMessage(chatId, default_answer);
        break;
    }
  }

  return NextResponse.json({ ok: true });
}
