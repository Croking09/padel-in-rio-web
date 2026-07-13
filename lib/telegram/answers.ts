import { InscriptionRow } from "@/lib/types/inscription";
import { Match } from "@/lib/types/match";
import { TournamentRow } from "@/lib/types/tournament";

export const default_answer =
  "No entiendo eso 😅, comprueba lo que puedo hacer con /help";

export const start_answer =
  "¡Hola! Soy BonIA 🤖, tu asistente de Padel in Rio.";

export const help_answer =
  `🤖: Esto es lo que puedo hacer\n\n` +
  `/start - Inicia el bot\n` +
  `/help - Muestra esta ayuda\n` +
  `/partidos - Muestra los partidos de la liga, puedes indicar el mes con el formato MM/AAAA, o no poner nada y ver el mes más actual\n\n` +
  `Opciones de admin:\n\n` +
  `/pdf - Genera un PDF con los partidos de la liga para el último mes confirmado\n` +
  `/inscripciones - Muestra las inscripciones para los torneos activos\n` +
  `(Si eres admin también te llegan avisos de nuevas inscripciones)\n`;

export type OpenTournamentInscription = InscriptionRow & {
  tournament: Pick<
    TournamentRow,
    "id" | "name" | "inscription_end_date" | "manually_closed"
  >;
};

export function formatInscriptions(
  inscriptions: OpenTournamentInscription[],
): string {
  const tournamentsMap = new Map<string, OpenTournamentInscription[]>();

  inscriptions.forEach((inscription) => {
    const tournamentName = inscription.tournament.name;

    if (!tournamentsMap.has(tournamentName)) {
      tournamentsMap.set(tournamentName, []);
    }

    tournamentsMap.get(tournamentName)!.push(inscription);
  });

  let message = "📝 *Inscripciones*\n\n";

  tournamentsMap.forEach((tournamentInscriptions, tournamentName) => {
    message += `🏆 *${tournamentName}*\n`;

    tournamentInscriptions.forEach((inscription, index) => {
      message += `\n${index + 1}. ${inscription.player1_full_name} & ${inscription.player2_full_name}\n`;
      message += `📱 ${inscription.phone_number}\n`;

      if (inscription.category) {
        message += `🎯 Categoría: ${inscription.category}\n`;
      }
    });

    message += "\n";
  });

  return message;
}

export function newInscriptionMessage(
  torneoName: string,
  player1FullName: string,
  player2FullName: string,
  phoneNumber: string,
  category: string | null | undefined,
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
