import { handleCallback } from "@/lib/telegram/callback";
import { handleMessage } from "@/lib/telegram/message";
import { TelegramUpdate } from "@/lib/types/telegram";
import { NextResponse } from "next/server";

export async function handleTelegramUpdate(update: TelegramUpdate) {
  if (update.callback_query) {
    await handleCallback(update.callback_query);
    return NextResponse.json({ ok: true });
  }

  if (update.message) {
    await handleMessage(update.message);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
