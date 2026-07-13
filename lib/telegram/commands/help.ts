import { sendMessage } from "@/lib/telegram/utils";

const helpAnswer =
  `🤖: Esto es lo que puedo hacer\n\n` +
  `/start - Inicia el bot\n` +
  `/help - Muestra esta ayuda\n` +
  `/partidos - Muestra los partidos de la liga, puedes indicar el mes con el formato MM/AAAA, o no poner nada y ver el mes más actual\n\n` +
  `Opciones de admin:\n\n` +
  `/pdf - Genera un PDF con los partidos de la liga para el último mes confirmado\n` +
  `/inscripciones - Muestra las inscripciones para los torneos activos\n` +
  `(Si eres admin también te llegan avisos de nuevas inscripciones)\n`;

export async function helpCommand(chatId: number) {
  await sendMessage(chatId, helpAnswer, {
    reply_markup: {
      inline_keyboard: [],
    },
  });
}
