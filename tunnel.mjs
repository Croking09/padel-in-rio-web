import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import qrcode from "qrcode-terminal";

const envPath = path.resolve(process.cwd(), ".env.local");

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");

  envConfig.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);

    if (match) {
      const key = match[1];
      let value = match[2] || "";

      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }

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

const puertoLocal = "3000";

const cf = spawn("cloudflared", [
  "tunnel",
  "--url",
  `http://localhost:${puertoLocal}`,
]);

console.log("Iniciando túnel de Cloudflare...");

let webhookConfigurado = false;

cf.stderr.on("data", (data) => {
  if (webhookConfigurado) return;

  const line = data.toString();
  const match = line.match(/https:\/\/[a-zA-Z0-9.-]+\.trycloudflare\.com/);

  if (!match) return;

  webhookConfigurado = true;

  const tunnelUrl = match[0];
  const webhookUrl = `${tunnelUrl}/telegram`;
  const waitMs = 5000;

  console.log(`\n\x1b[36m[TÚNEL]\x1b[0m ${tunnelUrl}`);

  console.log("\nEscanea este QR para abrir la web en el móvil:\n");
  qrcode.generate(tunnelUrl, { small: true });

  console.log(`\nEsperando ${waitMs} ms a la propagación del DNS...\n`);

  setTimeout(() => {
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook`;

    const curl = spawn("curl", [
      "-s",
      "-X",
      "POST",
      telegramApiUrl,
      "-d",
      `url=${webhookUrl}`,
      "-d",
      `secret_token=${SECRET_TOKEN}`,
    ]);

    curl.stdout.on("data", (curlData) => {
      console.log(`\x1b[32m[TELEGRAM]\x1b[0m ${curlData.toString().trim()}`);
    });

    curl.stderr.on("data", (err) => {
      console.error(`\x1b[31m[ERROR]\x1b[0m ${err.toString().trim()}`);
    });
  }, waitMs);
});

cf.on("error", (err) => {
  console.error(
    `\x1b[31m[ERROR]\x1b[0m No se pudo iniciar cloudflared: ${err.message}`,
  );
});

cf.on("close", (code) => {
  if (code !== 0) {
    console.error(
      `\x1b[31m[ERROR]\x1b[0m cloudflared finalizó con código ${code}`,
    );
  }
});

process.on("SIGINT", () => {
  console.log("\nCerrando túnel...");
  cf.kill();
  process.exit(0);
});

process.on("SIGTERM", () => {
  cf.kill();
  process.exit(0);
});
