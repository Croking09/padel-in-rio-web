import "@testing-library/jest-dom";
import ReactDOMServer from "react-dom/server";
import Page from "@/app/admin/torneos/[id]/inscripciones/page";

jest.mock("@/app/actions/inscripciones", () => ({
  getInscripcionesByTorneo: jest.fn(),
}));

jest.mock("@/app/actions/torneos", () => ({
  getTorneoById: jest.fn(),
}));

import { getInscripcionesByTorneo } from "@/app/actions/inscripciones";
import { getTorneoById } from "@/app/actions/torneos";

describe("Inscripciones Page", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-05-09T12:00:00"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("displays tournament information correctly", async () => {
    getTorneoById.mockResolvedValue({
      id: 1,
      name: "Primavera 2024",
      description: "Torneo de primavera",
      start_date: "2024-05-11T00:00:00",
      end_date: "2024-05-13T00:00:00",
      inscription_end_date: "2024-05-10T00:00:00",
      manually_closed: false,
    });

    getInscripcionesByTorneo.mockResolvedValue({
      data: [],
    });

    const params = Promise.resolve({ id: "1" });
    const html = ReactDOMServer.renderToString(await Page({ params }));

    expect(html).toContain("Primavera 2024");
    expect(html).toContain("Torneo de primavera");
    expect(html).toContain("Inicio:");
    expect(html).toContain("11/05/2024");
    expect(html).toContain("Fin:");
    expect(html).toContain("13/05/2024");
    expect(html).toContain("Cierre inscripciones:");
    expect(html).toContain("10/05/2024");
  });

  test("displays manually closed message when tournament is manually closed", async () => {
    getTorneoById.mockResolvedValue({
      id: 1,
      name: "Primavera 2024",
      description: "Torneo de primavera",
      start_date: "2024-05-11T00:00:00",
      end_date: "2024-05-13T00:00:00",
      inscription_end_date: "2024-05-10T00:00:00",
      manually_closed: true,
    });

    getInscripcionesByTorneo.mockResolvedValue({
      data: [],
    });

    const params = Promise.resolve({ id: "1" });
    const html = ReactDOMServer.renderToString(await Page({ params }));

    expect(html).toContain("Inscripciones cerradas manualmente");
  });

  test("displays empty state when there are no inscriptions", async () => {
    getTorneoById.mockResolvedValue({
      id: 1,
      name: "Primavera 2024",
      description: "Torneo de primavera",
      start_date: "2024-05-11T00:00:00",
      end_date: "2024-05-13T00:00:00",
      inscription_end_date: "2024-05-10T00:00:00",
      manually_closed: false,
    });

    getInscripcionesByTorneo.mockResolvedValue({
      data: [],
    });

    const params = Promise.resolve({ id: "1" });
    const html = ReactDOMServer.renderToString(await Page({ params }));

    expect(html).toContain("Primavera 2024");
    expect(html).toContain("No hay inscripciones");
  });

  test("displays inscriptions table with data", async () => {
    getTorneoById.mockResolvedValue({
      id: 1,
      name: "Primavera 2024",
      description: "Torneo de primavera",
      start_date: "2024-05-11T00:00:00",
      end_date: "2024-05-13T00:00:00",
      inscription_end_date: "2024-05-10T00:00:00",
      manually_closed: false,
    });

    getInscripcionesByTorneo.mockResolvedValue({
      data: [
        {
          id: 1,
          player_1_full_name: "Juan Pérez",
          player_2_full_name: "María García",
          phone_number: "123456789",
          category: "Masculino",
        },
        {
          id: 2,
          player_1_full_name: "Carlos López",
          player_2_full_name: "Ana Martínez",
          phone_number: "987654321",
          category: "Femenino",
        },
      ],
    });

    const params = Promise.resolve({ id: "1" });
    const html = ReactDOMServer.renderToString(await Page({ params }));

    expect(html).toMatch(/Inscripciones \(.*2.*\)/);
    expect(html).toContain("Jugador 1");
    expect(html).toContain("Jugador 2");
    expect(html).toContain("Categor");
    expect(html).toContain("Juan Pérez");
    expect(html).toContain("María García");
    expect(html).toContain("123456789");
    expect(html).toContain("Masculino");
    expect(html).toContain("Carlos López");
    expect(html).toContain("Ana Martínez");
    expect(html).toContain("987654321");
    expect(html).toContain("Femenino");
  });

  test("displays dash when category is null", async () => {
    getTorneoById.mockResolvedValue({
      id: 1,
      name: "Primavera 2024",
      description: "Torneo de primavera",
      start_date: "2024-05-11T00:00:00",
      end_date: "2024-05-13T00:00:00",
      inscription_end_date: "2024-05-10T00:00:00",
      manually_closed: false,
    });

    getInscripcionesByTorneo.mockResolvedValue({
      data: [
        {
          id: 1,
          player_1_full_name: "Juan Pérez",
          player_2_full_name: "María García",
          phone_number: "123456789",
          category: null,
        },
      ],
    });

    const params = Promise.resolve({ id: "1" });
    const html = ReactDOMServer.renderToString(await Page({ params }));

    expect(html).toContain("—");
  });

  test("displays not found message when tournament does not exist", async () => {
    getTorneoById.mockResolvedValue(null);

    getInscripcionesByTorneo.mockResolvedValue({
      data: [],
    });

    const params = Promise.resolve({ id: "999" });
    const html = ReactDOMServer.renderToString(await Page({ params }));

    expect(html).toContain("Torneo no encontrado");
  });

  test("does not display description when it is not provided", async () => {
    getTorneoById.mockResolvedValue({
      id: 1,
      name: "Primavera 2024",
      description: null,
      start_date: "2024-05-11T00:00:00",
      end_date: "2024-05-13T00:00:00",
      inscription_end_date: "2024-05-10T00:00:00",
      manually_closed: false,
    });

    getInscripcionesByTorneo.mockResolvedValue({
      data: [],
    });

    const params = Promise.resolve({ id: "1" });
    const html = ReactDOMServer.renderToString(await Page({ params }));

    expect(html).toContain("Primavera 2024");
    // Description should not be rendered when null
    expect(html).not.toContain("<p>null</p>");
  });
});
