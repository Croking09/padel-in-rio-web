import { render, screen } from "@testing-library/react";
import Page from "@/app/liga/clasificacion/page";

// Mocks
jest.mock("@/app/actions/ligas", () => ({
  getTemporadas: jest.fn(),
}));

jest.mock("@/app/actions/clasificacion", () => ({
  getGeneralClassification: jest.fn(),
}));

import { getTemporadas } from "@/app/actions/ligas";
import { getGeneralClassification } from "@/app/actions/clasificacion";

const mockTemporadas = [{ id: 1, name: "2025" }];

const mockData = [
  {
    player_id: 1,
    nickname: "Manolito",
    full_name: "Manolito García",
    points: 26,
    diff: 9,
    games_for: 18,
    matches_played: 6,
  },
  {
    player_id: 2,
    nickname: "Pepe",
    full_name: "Pepe López",
    points: 24,
    diff: -6,
    games_for: 24,
    matches_played: 8,
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  (getTemporadas).mockResolvedValue(mockTemporadas);
});

describe("ClasificacionGeneral Page", () => {
  it("muestra el título", async () => {
    (getGeneralClassification).mockResolvedValue(mockData);
    render(await Page({ searchParams: Promise.resolve({}) }));
    expect(screen.getByText("Clasificación General")).toBeInTheDocument();
  });

  it("muestra la tabla cuando hay datos", async () => {
    (getGeneralClassification).mockResolvedValue(mockData);
    render(await Page({ searchParams: Promise.resolve({}) }));
    expect(screen.getByText("Manolito")).toBeInTheDocument();
    expect(screen.getByText("Pepe")).toBeInTheDocument();
  });

  it("muestra el mensaje vacío cuando no hay datos", async () => {
    (getGeneralClassification).mockResolvedValue([]);
    render(await Page({ searchParams: Promise.resolve({}) }));
    expect(
      screen.getByText("No se encontraron datos para la temporada seleccionada.")
    ).toBeInTheDocument();
  });

  it("usa la temporadaId del searchParam si se proporciona", async () => {
    (getGeneralClassification).mockResolvedValue(mockData);
    render(await Page({ searchParams: Promise.resolve({ temporadaId: "2" }) }));
    expect(getGeneralClassification).toHaveBeenCalledWith(2);
  });

  it("usa la primera temporada como fallback si no hay searchParam", async () => {
    (getGeneralClassification).mockResolvedValue(mockData);
    render(await Page({ searchParams: Promise.resolve({}) }));
    expect(getGeneralClassification).toHaveBeenCalledWith(1);
  });

  it("muestra la nota sobre jugadores con al menos un partido", async () => {
    (getGeneralClassification).mockResolvedValue(mockData);
    render(await Page({ searchParams: Promise.resolve({}) }));
    expect(
      screen.getByText(/Solo se muestran jugadores/i)
    ).toBeInTheDocument();
  });
});