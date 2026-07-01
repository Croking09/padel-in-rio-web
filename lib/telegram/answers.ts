import { Match } from "@/lib/types/match";
import { formatMonth } from "@/lib/utils";
import type { Month } from "@/lib/types/month";
import type { MonthParticipation } from "@/lib/types/monthParticipation";
import type { Socio } from "@/lib/types/socio";

export const default_answer =
  "No entiendo eso 😅, comprueba lo que puedo hacer con /help";

export const start_answer =
  "¡Hola! Soy BonIA 🤖, tu asistente de Padel in Rio.";

export const help_answer =
  `🤖: Esto es lo que puedo hacer\n\n` +
  `/start - Inicia el bot\n` +
  `/help - Muestra esta ayuda\n` +
  `/participacion - Muestra el historico de participacion de un socio\n` +
  `/partidos - Muestra los partidos de la liga, puedes indicar el mes con el formato MM/AAAA, o no poner nada y ver el mes más actual\n\n` +
  `Opciones de admin:\n\n` +
  `/pdf - Genera un PDF con los partidos de la liga para el último mes confirmado\n` +
  `/inscripciones - Muestra las inscripciones para los torneos activos\n` +
  `(Si eres admin también te llegan avisos de nuevas inscripciones)\n`;

interface Torneo {
  id: number;
  name: string;
  manually_closed: boolean;
  inscription_end_date: string;
}

interface Inscripcion {
  id: number;
  torneo_id: number;
  user_id: string;
  phone_number: string;
  category: string | null;
  player_1_full_name: string;
  player_2_full_name: string;
  torneo: Torneo;
}

export function formatInscripciones(inscripciones: Inscripcion[]): string {
  const torneosMap = new Map<string, Inscripcion[]>();

  inscripciones.forEach((inscripcion) => {
    const torneoName = inscripcion.torneo?.name || "Torneo desconocido";
    if (!torneosMap.has(torneoName)) {
      torneosMap.set(torneoName, []);
    }
    torneosMap.get(torneoName)!.push(inscripcion);
  });

  let message = "📝 *Inscripciones*\n\n";

  torneosMap.forEach((inscripcionesTorneo, torneoName) => {
    message += `🏆 *${torneoName}*\n`;

    inscripcionesTorneo.forEach((insc, index) => {
      message += `\n${index + 1}. ${insc.player_1_full_name} & ${insc.player_2_full_name}\n`;
      message += `📱 ${insc.phone_number}\n`;
      if (insc.category) {
        message += `🎯 Categoría: ${insc.category}\n`;
      }
    });

    message += "\n";
  });

  return message;
}

export function newInscripcionMessage(
  torneoName: string,
  player1FullName: string,
  player2FullName: string,
  phoneNumber: string,
  category: string | null,
) {
  const adminMessage =
    `📝 *Nueva inscripción*\n\n` +
    `🏆 Torneo: *${torneoName}*\n` +
    `👤 Jugadores: ${player1FullName} & ${player2FullName}\n` +
    `📱 Teléfono: ${phoneNumber}\n` +
    (category ? `🎯 Categoría: ${category}\n` : "");

  return adminMessage;
}

export function buildMatchesAnswer(
  matchesByDay: Record<number, Record<string, Match[]>>,
) {
  let text = "";

  Object.entries(matchesByDay).forEach(([day, categories]) => {
    text += `Jornada ${day}:\n\n`;

    Object.entries(categories).forEach(([category, categoryMatches]) => {
      text += `${category}:\n`;
      categoryMatches.forEach((match) => {
        const names = match.players.map((p) => p.nickname || p.full_name);
        text += names.join(", ") + "\n";
      });
      text += "\n";
    });

    text += "\n";
  });

  return text;
}

export function buildParticipationHistoricAnswer(
  socio: Socio,
  participation: MonthParticipation[],
  months: Month[],
) {
  const monthById = new Map(months.map((month) => [month.id, month]));
  const sortedParticipation = [...participation].sort((a, b) => {
    const monthA = monthById.get(a.monthId);
    const monthB = monthById.get(b.monthId);

    if (!monthA || !monthB) return a.monthId - b.monthId;
    if (monthA.year !== monthB.year) return monthA.year - monthB.year;
    return monthA.month - monthB.month;
  });

  let text = `🎾 Historico de participacion\n`;
  text += `👤 ${socio.full_name}`;
  if (socio.nickname) text += ` (${socio.nickname})`;
  text += "\n\n";

  if (!sortedParticipation.length) {
    return text + "📭 No hay participacion registrada para este socio.";
  }

  sortedParticipation.forEach((item) => {
    const month = monthById.get(item.monthId);
    const monthText = month
      ? `${formatMonth(month.month)} ${month.year}`
      : "Mes no encontrado";

    text += `📅 ${monthText}: Categoria ${item.categoryId}\n`;
  });

  text += `\n✅ Total: ${sortedParticipation.length} meses`;

  return text;
}
