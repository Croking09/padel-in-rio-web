import { createTorneo } from "@/app/actions/torneos";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

jest.mock("@/lib/supabase/server");
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
  unstable_cache: jest.fn((fn) => fn), // Funcion sin cachear
}));

describe("createTorneo", () => {
  let mockSupabase;
  let mockStorage;
  let mockFrom;

  beforeEach(() => {
    jest.clearAllMocks();

    mockStorage = {
      from: jest.fn().mockReturnValue({
        remove: jest.fn().mockResolvedValue({ error: null }),
      }),
    };

    mockFrom = jest.fn().mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
    });

    mockSupabase = {
      storage: mockStorage,
      from: mockFrom,
    };

    createClient.mockResolvedValue(mockSupabase);
  });

  describe("Required fields validation", () => {
    test("should return error if name is missing", async () => {
      const formData = new FormData();
      formData.append("description", "Descripción");
      formData.append("start_date", "2022-01-02T10:00:00Z");
      formData.append("end_date", "2022-01-03T10:00:00Z");
      formData.append("inscription_end_date", "2022-01-01T10:00:00Z");

      const result = await createTorneo({}, formData);

      expect(result.error).toBe("Faltan campos obligatorios.");
      expect(result.success).toBeUndefined();
    });

    test("should return error if start_date is missing", async () => {
      const formData = new FormData();
      formData.append("name", "Torneo de Primavera");
      formData.append("description", "Descripción");
      formData.append("end_date", "2022-01-03T10:00:00Z");
      formData.append("inscription_end_date", "2022-01-01T10:00:00Z");

      const result = await createTorneo({}, formData);

      expect(result.error).toBe("Faltan campos obligatorios.");
    });

    test("should return error if end_date is missing", async () => {
      const formData = new FormData();
      formData.append("name", "Torneo de Primavera");
      formData.append("description", "Descripción");
      formData.append("start_date", "2022-01-02T10:00:00Z");
      formData.append("inscription_end_date", "2022-01-01T10:00:00Z");

      const result = await createTorneo({}, formData);

      expect(result.error).toBe("Faltan campos obligatorios.");
    });

    test("should return error if inscription_end_date is missing", async () => {
      const formData = new FormData();
      formData.append("name", "Torneo de Primavera");
      formData.append("description", "Descripción");
      formData.append("start_date", "2022-01-02T10:00:00Z");
      formData.append("end_date", "2022-01-03T10:00:00Z");

      const result = await createTorneo({}, formData);

      expect(result.error).toBe("Faltan campos obligatorios.");
    });

    test("should delete the image if required fields are missing", async () => {
      const formData = new FormData();
      formData.append("name", "Torneo de Primavera");
      formData.append("img_path", "02-01-2022.jpg");

      await createTorneo({}, formData);

      expect(mockStorage.from).toHaveBeenCalledWith("torneos");
      expect(mockStorage.from().remove).toHaveBeenCalledWith([
        "02-01-2022.jpg",
      ]);
    });
  });

  describe("Date validations", () => {
    test("should return error if inscription_end_date is equal to start_date", async () => {
      const formData = new FormData();
      formData.append("name", "Torneo de Primavera");
      formData.append("description", "Descripción");
      formData.append("start_date", "2022-01-02T10:00:00Z");
      formData.append("end_date", "2022-01-03T10:00:00Z");
      formData.append("inscription_end_date", "2022-01-02T10:00:00Z");

      const result = await createTorneo({}, formData);

      expect(result.error).toBe(
        "El cierre de inscripciones debe ser anterior al inicio del torneo.",
      );
    });

    test("should return error if inscription_end_date is after start_date", async () => {
      const formData = new FormData();
      formData.append("name", "Torneo de Primavera");
      formData.append("description", "Descripción");
      formData.append("start_date", "2022-01-02T10:00:00Z");
      formData.append("end_date", "2022-01-03T10:00:00Z");
      formData.append("inscription_end_date", "2022-01-03T10:00:00Z");

      const result = await createTorneo({}, formData);

      expect(result.error).toBe(
        "El cierre de inscripciones debe ser anterior al inicio del torneo.",
      );
    });

    test("should return error if start_date is equal to end_date", async () => {
      const formData = new FormData();
      formData.append("name", "Torneo de Primavera");
      formData.append("description", "Descripción");
      formData.append("start_date", "2022-01-02T10:00:00Z");
      formData.append("end_date", "2022-01-02T10:00:00Z");
      formData.append("inscription_end_date", "2022-01-01T10:00:00Z");

      const result = await createTorneo({}, formData);

      expect(result.error).toBe(
        "La fecha de inicio debe ser anterior a la fecha de fin.",
      );
    });

    test("should return error if start_date is after end_date", async () => {
      const formData = new FormData();
      formData.append("name", "Torneo de Primavera");
      formData.append("description", "Descripción");
      formData.append("start_date", "2022-01-03T10:00:00Z");
      formData.append("end_date", "2022-01-02T10:00:00Z");
      formData.append("inscription_end_date", "2022-01-01T10:00:00Z");

      const result = await createTorneo({}, formData);

      expect(result.error).toBe(
        "La fecha de inicio debe ser anterior a la fecha de fin.",
      );
    });

    test("should delete the image if there is a date validation error", async () => {
      const formData = new FormData();
      formData.append("name", "Torneo de Primavera");
      formData.append("description", "Descripción");
      formData.append("start_date", "2022-01-03T10:00:00Z");
      formData.append("end_date", "2022-01-02T10:00:00Z");
      formData.append("inscription_end_date", "2022-01-01T10:00:00Z");
      formData.append("img_path", "01-01-2022.jpg");

      await createTorneo({}, formData);

      expect(mockStorage.from).toHaveBeenCalledWith("torneos");
      expect(mockStorage.from().remove).toHaveBeenCalledWith([
        "01-01-2022.jpg",
      ]);
    });
  });

  describe("Successful creation", () => {
    test("should create a tournament correctly with all fields", async () => {
      const formData = new FormData();
      formData.append("name", "Torneo de Primavera");
      formData.append("description", "Descripción del torneo");
      formData.append("start_date", "2022-01-02T10:00:00Z");
      formData.append("end_date", "2022-01-03T10:00:00Z");
      formData.append("inscription_end_date", "2022-01-01T10:00:00Z");
      formData.append("img_path", "02-01-2022.jpg");
      formData.append("categories", "1ª Masculina");
      formData.append("categories", "2ª Femenina");

      const result = await createTorneo({}, formData);

      expect(mockFrom).toHaveBeenCalledWith("Torneos");
      expect(mockFrom().insert).toHaveBeenCalledWith({
        name: "Torneo de Primavera",
        description: "Descripción del torneo",
        start_date: "2022-01-02T10:00:00Z",
        end_date: "2022-01-03T10:00:00Z",
        inscription_end_date: "2022-01-01T10:00:00Z",
        img_path: "02-01-2022.jpg",
        categories: ["1ª Masculina", "2ª Femenina"],
        manually_closed: false,
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Torneo creado exitosamente.");
    });

    test("should create a tournament without an image", async () => {
      const formData = new FormData();
      formData.append("name", "Torneo de Primavera");
      formData.append("description", "Descripción del torneo");
      formData.append("start_date", "2022-01-02T10:00:00Z");
      formData.append("end_date", "2022-01-03T10:00:00Z");
      formData.append("inscription_end_date", "2022-01-01T10:00:00Z");

      const result = await createTorneo({}, formData);

      expect(mockFrom().insert).toHaveBeenCalledWith(
        expect.objectContaining({
          img_path: null,
        }),
      );

      expect(result.success).toBe(true);
    });

    test("should create a tournament without categories", async () => {
      const formData = new FormData();
      formData.append("name", "Torneo de Primavera");
      formData.append("description", "Descripción del torneo");
      formData.append("start_date", "2022-01-02T10:00:00Z");
      formData.append("end_date", "2022-01-03T10:00:00Z");
      formData.append("inscription_end_date", "2022-01-01T10:00:00Z");

      const result = await createTorneo({}, formData);

      expect(mockFrom().insert).toHaveBeenCalledWith(
        expect.objectContaining({
          categories: null,
        }),
      );

      expect(result.success).toBe(true);
    });

    test("should revalidate paths after creating the tournament", async () => {
      const formData = new FormData();
      formData.append("name", "Torneo de Primavera");
      formData.append("description", "Descripción del torneo");
      formData.append("start_date", "2022-01-02T10:00:00Z");
      formData.append("end_date", "2022-01-03T10:00:00Z");
      formData.append("inscription_end_date", "2022-01-01T10:00:00Z");

      await createTorneo({}, formData);

      expect(revalidatePath).toHaveBeenCalledWith("/");
      expect(revalidatePath).toHaveBeenCalledWith("/torneos");
    });
  });

  describe("Database error", () => {
    test("should return error if database insertion fails", async () => {
      mockFrom.mockReturnValue({
        insert: jest.fn().mockResolvedValue({
          error: { message: "Database error" },
        }),
      });

      const formData = new FormData();
      formData.append("name", "Torneo de Primavera");
      formData.append("description", "Descripción del torneo");
      formData.append("start_date", "2022-01-02T10:00:00Z");
      formData.append("end_date", "2022-01-03T10:00:00Z");
      formData.append("inscription_end_date", "2022-01-01T10:00:00Z");

      const result = await createTorneo({}, formData);

      expect(result.error).toBe(
        "Error al crear el torneo. Verifica los datos.",
      );
      expect(result.success).toBeUndefined();
    });

    test("should delete the image if database insertion fails", async () => {
      mockFrom.mockReturnValue({
        insert: jest.fn().mockResolvedValue({
          error: { message: "Database error" },
        }),
      });

      const formData = new FormData();
      formData.append("name", "Torneo de Primavera");
      formData.append("description", "Descripción del torneo");
      formData.append("start_date", "2022-01-02T10:00:00Z");
      formData.append("end_date", "2022-01-03T10:00:00Z");
      formData.append("inscription_end_date", "2022-01-01T10:00:00Z");
      formData.append("img_path", "02-01-2022.jpg");

      await createTorneo({}, formData);

      expect(mockStorage.from).toHaveBeenCalledWith("torneos");
      expect(mockStorage.from().remove).toHaveBeenCalledWith([
        "02-01-2022.jpg",
      ]);
    });
  });
});
