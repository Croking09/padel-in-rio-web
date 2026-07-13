import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// 1. Leer .env.local directamente a memoria sin crear archivos adicionales
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"'))
        value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'"))
        value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SECRET_TOKEN = process.env.TELEGRAM_WEBHOOK_SECRET;

if (!TELEGRAM_TOKEN || !SECRET_TOKEN) {
  console.error(
    "\x1b[31m[ERROR] Falta TELEGRAM_TOKEN o SECRET_TOKEN en tu .env.local\x1b[0m",
  );
  process.exit(1);
}

// 2. Arrancar el túnel de Cloudflare en segundo plano de forma silenciosa
const puertoLocal = "3000";
const cf = spawn("cloudflared", [
  "tunnel",
  "--url",
  `http://localhost:${puertoLocal}`,
]);

console.log("Iniciando túnel de Cloudflare...");

let webhookConfigurado = false;

// 3. Escuchar la salida en memoria únicamente para extraer la URL y mostrarla
cf.stderr.on("data", (data) => {
  if (webhookConfigurado) return;

  const line = data.toString();
  const match = line.match(/https:\/\/[a-zA-Z0-9.-]+\.trycloudflare\.com/);

  if (match) {
    webhookConfigurado = true;
    const tunnelUrl = match[0];

    const waitMs = 5000;
    // MUESTRA 1: Imprime la URL del túnel detectada
    console.log(`\x1b[36m[TÚNEL] URL asignada:\x1b[0m ${tunnelUrl}`);
    console.log(`Esperando ${waitMs} segundos a la propagación del DNS...`);

    // Esperar 6 segundos en segundo plano a que se propague el DNS antes de enviar a Telegram
    setTimeout(() => {
      const webhookUrl = `${tunnelUrl}/telegram`;
      const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook`;

      const curl = spawn("curl", [
        "-s", // Modo silencioso de curl (oculta la barra de progreso)
        "-X",
        "POST",
        telegramApiUrl,
        "-d",
        `url=${webhookUrl}`,
        "-d",
        `secret_token=${SECRET_TOKEN}`,
      ]);

      // MUESTRA 2: Imprime la respuesta de Telegram
      curl.stdout.on("data", (curlData) => {
        console.log(`\x1b[32m[TELEGRAM]\x1b[0m ${curlData.toString().trim()}`);
      });
    }, waitMs);
  }
});
