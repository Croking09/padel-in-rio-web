import { getAllInscriptionsForOpenTournaments } from "@/app/actions/inscription-actions";
import { requireAdmin } from "@/lib/telegram/commands/require-admin";
import { sendMessage } from "@/lib/telegram/utils";
import { InscriptionRow } from "@/lib/types/inscription";
import { TournamentRow } from "@/lib/types/tournament";

type OpenTournamentInscription = InscriptionRow & {
  tournament: Pick<
    TournamentRow,
    "name" | "inscription_end_date" | "manually_closed"
  >;
};

function formatInscriptions(inscriptions: OpenTournamentInscription[]): string {
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

export async function inscriptionsCommand(chatId: number) {
  if (!(await requireAdmin(chatId))) {
    return;
  }

  const result = await getAllInscriptionsForOpenTournaments();

  if (!result.success) {
    await sendMessage(chatId, `❌ ${result.error}`);
    return;
  }

  const inscriptions = result.data;

  if (!inscriptions?.length) {
    await sendMessage(chatId, "No hay inscripciones actualmente.");
    return;
  }

  await sendMessage(chatId, formatInscriptions(inscriptions), {
    parse_mode: "Markdown",
  });
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
