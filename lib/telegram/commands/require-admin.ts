import { sendMessage, TELEGRAM_ADMINS } from "@/lib/telegram/utils";

const notAdminAnswer = "No tienes permiso para usar este comando";

export async function requireAdmin(chatId: number): Promise<boolean> {
  if (!TELEGRAM_ADMINS.has(chatId)) {
    await sendMessage(chatId, notAdminAnswer);
    return false;
  }

  return true;
}
