import { NextResponse } from "next/server";
import { isTelegramConfigured } from "@/app/(server-lib)/telegram";

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json({
      ok: false,
      detail: "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set in env",
    });
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "USC Admin test message — Telegram bot is working!",
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(5000),
      },
    );
    const data = await res.json();

    if (data.ok) {
      return NextResponse.json({
        ok: true,
        detail: `Test message sent to chat ${chatId}`,
      });
    }
    return NextResponse.json({
      ok: false,
      detail: `Telegram API error: ${data.description || "Unknown error"}`,
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      detail: err instanceof Error ? err.message : "Telegram API unreachable",
    });
  }
}
