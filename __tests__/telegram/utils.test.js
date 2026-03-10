import { sendMessage, TELEGRAM_API } from "@/lib/telegram/utils";

describe("Telegram Utils", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ ok: true }),
      }),
    );

    process.env = {
      TELEGRAM_BOT_TOKEN: "FAKE_TOKEN",
      ADMIN_CHAT_IDS: "123,456",
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.env = originalEnv;
  });

  describe("sendMessage", () => {
    const chatId = 111;
    const text = "Hola mundo";

    it("should call fetch with correct url and body", async () => {
      await sendMessage(chatId, text);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      const [url, options] = global.fetch.mock.calls[0];

      expect(url).toBe(`${TELEGRAM_API}/sendMessage`);
      const body = JSON.parse(options.body);

      expect(body.chat_id).toBe(chatId);
      expect(body.text).toBe(text);
      expect(body.reply_markup.inline_keyboard).toEqual([
        [{ text: "Comandos 🤖", callback_data: "help" }],
      ]);
    });

    it("should overwrite default options with extra options", async () => {
      const extra = {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "Extra", callback_data: "x" }]],
        },
      };

      await sendMessage(chatId, text, extra);

      const body = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(body.parse_mode).toBe("Markdown");
      expect(body.reply_markup.inline_keyboard).toEqual([
        [{ text: "Extra", callback_data: "x" }],
      ]);
    });

    it("should return the json response", async () => {
      const result = await sendMessage(chatId, text);
      expect(result).toEqual({ ok: true });
    });
  });
});
