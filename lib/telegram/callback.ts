import { helpCommand } from "@/lib/telegram/commands/help";
import { TELEGRAM_API } from "./utils";
import { TelegramCallbackQuery } from "@/lib/types/telegram";

export async function handleCallback(callback: TelegramCallbackQuery) {
  const chatId = callback.from.id;
  const data = callback.data;

  if (data === "help") {
    await helpCommand(chatId);
  }

  await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      callback_query_id: callback.id,
      text: "👍",
    }),
  });
}
