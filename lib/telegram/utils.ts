import { InlineKeyboardButton } from "@/lib/types/telegram";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
export const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

export const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET!;

export const TELEGRAM_ADMINS = new Set(
  (process.env.ADMIN_CHAT_IDS || "")
    .split(",")
    .map((id) => Number(id))
    .filter(Boolean),
);

// Check https://core.telegram.org/bots/api for extra options
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendMessage(chat_id: number, text: string, extra?: any) {
  const defaultButtons: InlineKeyboardButton[][] = [
    [{ text: "Comandos 🤖", callback_data: "help" }],
  ];

  const body = {
    chat_id,
    text,
    reply_markup: {
      inline_keyboard: defaultButtons,
      ...extra?.reply_markup,
    },
    ...extra,
  };
  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function sendDocument(
  chat_id: number,
  document: Buffer | Blob,
  filename?: string,
) {
  const body = new FormData();

  body.append("chat_id", chat_id.toString());

  let blobDocument: Blob;
  if (document instanceof Buffer) {
    blobDocument = new Blob([new Uint8Array(document)], {
      type: "application/pdf",
    });
  } else {
    blobDocument = document as Blob;
  }

  body.append("document", blobDocument, filename ?? "document.pdf");

  const res = await fetch(`${TELEGRAM_API}/sendDocument`, {
    method: "POST",
    body,
  });

  return res.json();
}

const notAdminAnswer = "No tienes permiso para usar este comando";

export async function requireAdmin(chatId: number): Promise<boolean> {
  if (!TELEGRAM_ADMINS.has(chatId)) {
    await sendMessage(chatId, notAdminAnswer);
    return false;
  }

  return true;
}
