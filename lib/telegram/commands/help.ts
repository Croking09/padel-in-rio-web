import { requireAdmin, sendMessage } from "@/lib/telegram/utils";

const helpAnswer =
  `🤖 Bienvenido al bot de Pádel in Río.\n\n` +
  `Estos son los comandos disponibles:\n\n` +
  `▶️ /start\nInicia el bot.\n\n` +
  `❓ /help\nMuestra esta ayuda.\n\n` +
  `📅 /partidos [MM/AAAA]\nConsulta los partidos del mes indicado o del mes más reciente.`;

const adminHelpAnswer =
  `🔒 Funciones de administrador\n\n` +
  `📄 /pdf\nGenera el PDF del último mes confirmado.\n\n` +
  `📝 /inscripciones\nConsulta las inscripciones de los torneos activos.\n\n` +
  `♻️ /refresh\nInvalida la caché de una ruta.\n\n` +
  `📢 Además, recibirás avisos automáticos de nuevas inscripciones.`;

export async function helpCommand(chatId: number) {
  const isAdmin = await requireAdmin(chatId);

  await sendMessage(
    chatId,
    isAdmin ? `${helpAnswer}\n\n${adminHelpAnswer}` : helpAnswer,
    {
      reply_markup: {
        inline_keyboard: [],
      },
    },
  );
}
