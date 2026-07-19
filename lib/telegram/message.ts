import { sendMessage } from "@/lib/telegram/utils";
import { startCommand } from "@/lib/telegram/commands/start";
import { helpCommand } from "@/lib/telegram/commands/help";
import { inscriptionsCommand } from "@/lib/telegram/commands/inscriptions";
import { pdfCommand } from "@/lib/telegram/commands/pdf";
import { matchesCommand } from "@/lib/telegram/commands/matches";
import { TelegramMessage } from "@/lib/types/telegram";
import { refreshCommand } from "@/lib/telegram/commands/refresh";

const defaultAnswer =
  "No entiendo eso 😅, comprueba lo que puedo hacer con /help";

export async function handleMessage(message: TelegramMessage) {
  const chatId = message.from.id;
  const text = message.text?.trim() || "";

  switch (true) {
    case text === "/start":
      await startCommand(chatId);
      break;

    case text === "/help":
      await helpCommand(chatId);
      break;

    case text === "/inscripciones":
      await inscriptionsCommand(chatId);
      break;

    case text.startsWith("/pdf"):
      await pdfCommand(chatId);
      break;

    case text.startsWith("/partidos"):
      await matchesCommand(chatId, text);
      break;

    case text.startsWith("/refresh"):
      await refreshCommand(chatId, text);
      break;

    default:
      await sendMessage(chatId, defaultAnswer);
  }
}
