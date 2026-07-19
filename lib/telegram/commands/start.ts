import { sendMessage } from "@/lib/telegram/utils";

const startAnswer = "¡Hola! Soy BonIA 🤖, tu asistente de Padel in Rio.";

export async function startCommand(chatId: number) {
  await sendMessage(chatId, startAnswer);
}
