export const default_answer =
  "No entiendo eso 😅, comprueba lo que puedo hacer con /help";

export const start_answer =
  "¡Hola! Soy BonIA 🤖, tu asistente de Padel in Rio.";

export const help_answer =
  `🤖 Ayuda del Bot 🤖\n\n` +
  `Estos son los comandos disponibles:\n\n` +
  `/start - Inicia el bot\n` +
  `/help - Muestra esta ayuda\n\n` +
  `Opciones de admin:\n\n` +
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
