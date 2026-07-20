import { requireAdmin, sendMessage } from "@/lib/telegram/utils";
import { revalidatePath } from "next/cache";

export async function refreshCommand(chatId: number, message: string) {
  if (!(await requireAdmin(chatId))) {
    return;
  }

  const route = message.trim().split(" ")[1];

  if (!route) {
    await sendMessage(
      chatId,
      "❌ Debes indicar la ruta que quieres refrescar.\n\nEjemplo:\n/refresh /liga",
    );
    return;
  }

  if (!route.startsWith("/")) {
    await sendMessage(
      chatId,
      "❌ La ruta debe comenzar por '/'.\n\nEjemplo:\n/refresh /liga",
    );
    return;
  }

  revalidatePath(route);

  await sendMessage(
    chatId,
    `✅ La caché de la ruta:\n\n \`${route}\`\n\nSe ha invalidado correctamente.`,
    { parse_mode: "Markdown" },
  );
}
