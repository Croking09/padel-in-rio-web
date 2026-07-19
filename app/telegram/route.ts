import { NextRequest, NextResponse } from "next/server";
import { handleTelegramUpdate } from "@/lib/telegram/handler";
import { WEBHOOK_SECRET } from "@/lib/telegram/utils";

export async function POST(req: NextRequest) {
  const header = req.headers.get("x-telegram-bot-api-secret-token");

  if (header !== WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Only Pádel in Río Telegram BOTs allowed" },
      { status: 401 },
    );
  }

  const update = await req.json();

  return handleTelegramUpdate(update);
}
