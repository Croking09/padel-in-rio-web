import {
  formatInscripciones,
  newInscripcionMessage,
} from "@/lib/telegram/answers";
import { inscribirTorneo } from "@/app/actions/inscripciones";
import { sendMessage } from "@/lib/telegram/utils";
import { createClient } from "@/lib/supabase/server";

jest.mock("@/lib/telegram/utils", () => ({
  sendMessage: jest.fn(),
  ADMINS: new Set([111, 222, 333]),
}));

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  unstable_cache: (fn) => fn,
}));

describe("formatInscripciones", () => {
  it("should return header when empty array", () => {
    const result = formatInscripciones([]);
    expect(result).toBe("📝 *Inscripciones*\n\n");
  });

  it("should group inscripciones by torneo name", () => {
    const data = [
      {
        torneo: { name: "Torneo A" },
        player_1_full_name: "Juan Pérez",
        player_2_full_name: "Carlos López",
        phone_number: "123456789",
        category: "Primera",
      },
      {
        torneo: { name: "Torneo A" },
        player_1_full_name: "Luis García",
        player_2_full_name: "Miguel Torres",
        phone_number: "987654321",
        category: null,
      },
    ];

    const result = formatInscripciones(data);

    expect(result).toContain("🏆 *Torneo A*");
    expect(result).toContain("1. Juan Pérez & Carlos López");
    expect(result).toContain("2. Luis García & Miguel Torres");
  });

  it("should include category only when present", () => {
    const data = [
      {
        torneo: { name: "Torneo B" },
        player_1_full_name: "Ana Ruiz",
        player_2_full_name: "Laura Díaz",
        phone_number: "555555555",
        category: "Segunda",
      },
      {
        torneo: { name: "Torneo B" },
        player_1_full_name: "Eva Martín",
        player_2_full_name: "Clara León",
        phone_number: "444444444",
        category: null,
      },
    ];

    const result = formatInscripciones(data);

    expect(result).toContain("🎯 Categoría: Segunda");
    expect(result).not.toContain("🎯 Categoría: null");
  });

  it("should use 'Torneo desconocido' if torneo is null", () => {
    const data = [
      {
        torneo: null,
        player_1_full_name: "Pedro",
        player_2_full_name: "Pablo",
        phone_number: "111111111",
        category: null,
      },
    ];

    const result = formatInscripciones(data);

    expect(result).toContain("🏆 *Torneo desconocido*");
  });
});

describe("newInscripcionMessage", () => {
  it("should generate full message with category", () => {
    const result = newInscripcionMessage(
      "Torneo X",
      "Juan Pérez",
      "Carlos López",
      "123456789",
      "Primera",
    );

    expect(result).toContain("📝 *Nueva inscripción*");
    expect(result).toContain("🏆 Torneo: *Torneo X*");
    expect(result).toContain("👤 Jugadores: Juan Pérez & Carlos López");
    expect(result).toContain("📱 Teléfono: 123456789");
    expect(result).toContain("🎯 Categoría: Primera");
  });

  it("should not include category if null", () => {
    const result = newInscripcionMessage(
      "Torneo Y",
      "Ana",
      "Laura",
      "999999999",
      null,
    );

    expect(result).not.toContain("🎯 Categoría:");
  });
});

describe("inscribirTorneo - admin notifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send message to all admins when inscription succeeds", async () => {
    const mockUser = { id: "user-1" };

    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
      from: jest.fn((table) => {
        if (table === "Torneos") {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: {
                name: "Torneo Test",
                inscription_end_date: "2999-12-31",
                manually_closed: false,
              },
              error: null,
            }),
          };
        }

        if (table === "Inscripciones") {
          return {
            insert: jest.fn().mockResolvedValue({
              error: null,
            }),
          };
        }
      }),
    };

    createClient.mockResolvedValue(mockSupabase);

    await inscribirTorneo({
      torneo_id: 1,
      phone_number: "123456789",
      category: "Primera",
      player_1_full_name: "Juan Pérez",
      player_2_full_name: "Carlos López",
    });

    expect(sendMessage).toHaveBeenCalledTimes(3);

    expect(sendMessage).toHaveBeenCalledWith(
      111,
      expect.stringContaining("Nueva inscripción"),
      { parse_mode: "Markdown" },
    );

    expect(sendMessage).toHaveBeenCalledWith(222, expect.any(String), {
      parse_mode: "Markdown",
    });

    expect(sendMessage).toHaveBeenCalledWith(333, expect.any(String), {
      parse_mode: "Markdown",
    });
  });
});
