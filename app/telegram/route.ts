import { NextRequest, NextResponse } from "next/server";
import { getAllInscripcionesForOpenTorneos } from "@/app/actions/inscripciones";
import {
  default_answer,
  start_answer,
  help_answer,
  formatInscripciones,
  buildMatchesAnswer,
  buildParticipationHistoricAnswer,
} from "@/lib/telegram/answers";
import {
  sendMessage,
  TELEGRAM_API,
  ADMINS,
  sendDocument,
} from "@/lib/telegram/utils";
import { generateMatchesPdf } from "@/lib/pdf/generate-pdf";
import { getMatchesByDayGlobal } from "@/lib/liga/partidos";
import { MonthStatus } from "@/lib/types/month";
import { getMonths } from "../actions/ligas";
import { getAllSocios, getParticipationHistoric } from "../actions/socios";
import type { Socio } from "@/lib/types/socio";

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

      case text.startsWith("/participacion") ||
        text.startsWith("/participación"):
        const socioSearch = text.replace(/^\/participaci[oó]n\s*/i, "").trim();

        if (!socioSearch) {
          await sendMessage(
            chatId,
            "🎾 Dime el nombre del socio.\nEjemplo: /participacion Javier",
          );
          break;
        }

        const socios = await getAllSocios(true);
        const normalizedInput = socioSearch.toLowerCase();
        const exactMatches = (socios ?? []).filter((socio: Socio) => {
          const fullName = socio.full_name.toLowerCase();
          const nickname = (socio.nickname ?? "").toLowerCase();

          return fullName === normalizedInput || nickname === normalizedInput;
        });

        const matches =
          exactMatches.length > 0
            ? exactMatches
            : (socios ?? []).filter((socio: Socio) => {
                const fullName = socio.full_name.toLowerCase();
                const nickname = (socio.nickname ?? "").toLowerCase();

                return (
                  fullName.includes(normalizedInput) ||
                  nickname.includes(normalizedInput)
                );
              });

        if (matches.length === 0) {
          await sendMessage(
            chatId,
            `🔎 No encuentro ningun socio con "${socioSearch}".`,
          );
          break;
        }

        if (matches.length > 1) {
          const options = matches
            .slice(0, 6)
            .map((socio) => `• ${socio.full_name}`)
            .join("\n");

          await sendMessage(
            chatId,
            `🤔 He encontrado varios socios. Prueba con el nombre completo:\n\n${options}`,
          );
          break;
        }

        const [selectedSocio] = matches;
        const [participation, months] = await Promise.all([
          getParticipationHistoric(selectedSocio.id),
          getMonths(),
        ]);

        await sendMessage(
          chatId,
          buildParticipationHistoricAnswer(
            selectedSocio,
            participation,
            months,
          ),
        );
        break;

      case text.startsWith("/pdf"):
        if (!ADMINS.has(chatId)) {
          await sendMessage(chatId, "No tienes permiso para usar este comando");
          break;
        }

        const allMonths = await getMonths();
        const lastConfirmedMonth = allMonths
          .filter((m) => m.status === MonthStatus.Confirmed)
          .sort((a, b) =>
            a.year !== b.year ? a.year - b.year : a.month - b.month,
          )
          .at(-1);

        if (!lastConfirmedMonth) {
          await sendMessage(
            chatId,
            "Todavía no se han confirmado los partidos.",
          );
          break;
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
