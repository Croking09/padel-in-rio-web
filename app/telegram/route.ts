import { NextRequest, NextResponse } from "next/server";
import { getAllInscripcionesForOpenTorneos } from "@/app/actions/inscripciones";
import {
  default_answer,
  start_answer,
  help_answer,
  formatInscripciones,
} from "@/lib/telegram/answers";
import { sendMessage, TELEGRAM_API, ADMINS } from "@/lib/telegram/utils";

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
    const text = message.text?.trim();

    switch (text) {
      case "/start":
        await sendMessage(chatId, start_answer);
        break;
      case "/help":
        await sendMessage(chatId, help_answer, {
          reply_markup: {
            inline_keyboard: [],
          },
        });
        break;
      case "/inscripciones":
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
      default:
        await sendMessage(chatId, default_answer);
        break;
    }
  }

  return NextResponse.json({ ok: true });
}
