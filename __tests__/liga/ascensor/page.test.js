import { render, screen } from "@testing-library/react";

const mockGetAscensor = jest.fn();
const mockGetMonths = jest.fn();
const mockGetTemporadas = jest.fn();

jest.mock("@/app/actions/clasificacion", () => ({
  getAscensor: (...args) => mockGetAscensor(...args),
}));

jest.mock("@/app/actions/ligas", () => ({
  getMonths: (...args) => mockGetMonths(...args),
  getTemporadas: (...args) => mockGetTemporadas(...args),
}));

jest.mock("@/components/liga/month-selector", () => ({
  __esModule: true,
  default: ({ months }) => (
    <select aria-label="mes">
      {months.map((m) => (
        <option key={m.id} value={m.id}>
          {m.month}/{m.year}
        </option>
      ))}
    </select>
  ),
}));

import Page from "@/app/liga/ascensor/page";

const makePlayers = (count) =>
  Array.from({ length: count }, (_, i) => ({
    player_id: i + 1,
    nickname: `Jugador ${i + 1}`,
    full_name: `Full ${i + 1}`,
    points: (count - i) * 10,
    diff: count - i,
    games_for: count - i,
  }));

const makeAscensorData = (include5) => [
  { category: { id: 1, name: "1ª" }, classification: makePlayers(8) },
  { category: { id: 2, name: "2ª" }, classification: makePlayers(8) },
  { category: { id: 3, name: "3ª" }, classification: makePlayers(8) },
  { category: { id: 4, name: "4ª" }, classification: makePlayers(8) },
  ...(include5
    ? [{ category: { id: 5, name: "5ª" }, classification: makePlayers(8) }]
    : []),
];

const confirmedMonths = [
  {
    id: 1,
    month: 3,
    year: 2026,
    status: "confirmed",
    temporada_name: "2025/26",
    temporada_id: 1,
    "5_category": true,
  },
  {
    id: 2,
    month: 4,
    year: 2026,
    status: "confirmed",
    temporada_name: "2025/26",
    temporada_id: 1,
    "5_category": true,
  },
];

describe("Page (ascensor)", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 2, 15));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetMonths.mockResolvedValue(confirmedMonths);
    mockGetTemporadas.mockResolvedValue([{ id: 1, name: "2025/26" }]);

    mockGetAscensor.mockImplementation(async () => makeAscensorData(true));
  });

  describe("cuando hay meses confirmados y datos", () => {
    it("muestra el título", async () => {
      render(await Page({ searchParams: Promise.resolve({}) }));
      expect(screen.getByText("Ascensor")).toBeInTheDocument();
    });

    it("renderiza todas las categorías cuando existe 5ª", async () => {
      mockGetAscensor.mockResolvedValue(makeAscensorData(true));

      render(await Page({ searchParams: Promise.resolve({}) }));

      expect(screen.getByText("1ª")).toBeInTheDocument();
      expect(screen.getByText("2ª")).toBeInTheDocument();
      expect(screen.getByText("3ª")).toBeInTheDocument();
      expect(screen.getByText("4ª")).toBeInTheDocument();
      expect(screen.getByText("5ª")).toBeInTheDocument();
    });

    it("no renderiza 5ª cuando el mes no la tiene", async () => {
      mockGetAscensor.mockResolvedValue(makeAscensorData(false));

      render(await Page({ searchParams: Promise.resolve({}) }));

      expect(screen.getByText("1ª")).toBeInTheDocument();
      expect(screen.getByText("4ª")).toBeInTheDocument();
      expect(screen.queryByText("5ª")).not.toBeInTheDocument();
    });

    it("llama a getAscensor con el mes actual cuando no hay searchParam", async () => {
      render(await Page({ searchParams: Promise.resolve({}) }));
      expect(mockGetAscensor).toHaveBeenCalledWith(1);
    });

    it("llama a getAscensor con el monthId del searchParam", async () => {
      render(await Page({ searchParams: Promise.resolve({ monthId: "2" }) }));
      expect(mockGetAscensor).toHaveBeenCalledWith(2);
    });

    it("renderiza el MonthSelector", async () => {
      render(await Page({ searchParams: Promise.resolve({}) }));
      expect(screen.getByRole("combobox", { name: "mes" })).toBeInTheDocument();
    });
  });

  describe("cuando no hay meses confirmados", () => {
    beforeEach(() => {
      mockGetMonths.mockResolvedValue([
        {
          id: 1,
          month: 3,
          year: 2026,
          status: "pending",
          temporada_name: "2025/26",
          temporada_id: 1,
        },
      ]);
    });

    it("muestra aviso de sin meses", async () => {
      render(await Page({ searchParams: Promise.resolve({}) }));
      expect(
        screen.getByText("No hay meses confirmados para mostrar."),
      ).toBeInTheDocument();
    });

    it("no renderiza selector", async () => {
      render(await Page({ searchParams: Promise.resolve({}) }));
      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    });
  });

  describe("cuando no hay datos", () => {
    beforeEach(() => {
      mockGetAscensor.mockResolvedValue([]);
    });

    it("muestra mensaje de sin datos", async () => {
      render(await Page({ searchParams: Promise.resolve({}) }));
      expect(
        screen.getByText("No se encontraron datos para el mes seleccionado."),
      ).toBeInTheDocument();
    });
  });
});