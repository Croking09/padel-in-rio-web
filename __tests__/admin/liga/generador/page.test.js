jest.mock("@/app/actions/generador-partidos", () => ({
  previewMonth: jest.fn(),
}));

jest.mock("@/app/actions/ligas", () => ({
  getMonths: jest.fn(),
  getTemporadas: jest.fn(),
}));

jest.mock("@/lib/utils", () => ({
  ...jest.requireActual("@/lib/utils"),
  getCurrentMonthId: jest.fn(),
}));

jest.mock("@/components/liga/admin/generador/confirm-button", () => {
  return function ConfirmButton({ monthId }) {
    return <button data-testid="confirm-button">Confirmar ({monthId})</button>;
  };
});

jest.mock("@/components/liga/month-selector", () => {
  return function MonthSelector({ months, currentMonthId }) {
    return (
      <select data-testid="month-selector" value={currentMonthId}>
        {months.map((m) => (
          <option key={m.id} value={m.id}>
            {m.month}/{m.year}
          </option>
        ))}
      </select>
    );
  };
});

import { render, screen } from "@testing-library/react";
import Page from "@/app/admin/liga/generador/page";
import { previewMonth } from "@/app/actions/generador-partidos";
import { getMonths, getTemporadas } from "@/app/actions/ligas";
import { getCurrentMonthId } from "@/lib/utils";

const mockGetMonths = getMonths;
const mockPreviewMonth = previewMonth;
const mockGetTemporadas = getTemporadas;
const mockGetCurrentMonthId = getCurrentMonthId;

const TEMPORADA_ID = 1;

describe("Match Generator Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetTemporadas.mockResolvedValue([{ id: TEMPORADA_ID, name: "2024" }]);
    mockGetCurrentMonthId.mockReturnValue(undefined);
  });

  const mockMonths = [
    { id: 1, month: 1, year: 2024, status: "locked", temporada_id: TEMPORADA_ID },
    { id: 2, month: 2, year: 2024, status: "confirmed", temporada_id: TEMPORADA_ID },
    { id: 3, month: 3, year: 2024, status: "draft", temporada_id: TEMPORADA_ID },
  ];

  const mockMatches = [
    {
      matchday: 1,
      categoryName: "Categoría A",
      players: [
        { id: 1, full_name: "Jugador 1", nickname: "J1" },
        { id: 2, full_name: "Jugador 2", nickname: "J2" },
      ],
    },
    {
      matchday: 1,
      categoryName: "Categoría B",
      players: [
        { id: 3, full_name: "Jugador 3", nickname: "J3" },
        { id: 4, full_name: "Jugador 4", nickname: null },
      ],
    },
    {
      matchday: 2,
      categoryName: "Categoría A",
      players: [
        { id: 5, full_name: "Jugador 5" },
        { id: 6, full_name: "Jugador 6" },
      ],
    },
  ];

  it("should render the title correctly", async () => {
    mockGetMonths.mockResolvedValue([{ id: 1, month: 1, year: 2024, status: "draft", temporada_id: TEMPORADA_ID }]);

    const jsx = await Page({
      searchParams: Promise.resolve({ monthId: "" }),
    });
    render(jsx);

    expect(screen.getByText("Generador de Partidos")).toBeInTheDocument();
  });

  it("should show warning message when month is not confirmed", async () => {
    mockGetMonths.mockResolvedValue(mockMonths);

    const jsx = await Page({
      searchParams: Promise.resolve({ monthId: "3" }),
    });
    render(jsx);

    expect(
      screen.getByText(
        /No se pueden generar partidos para un mes sin confirmar/i,
      ),
    ).toBeInTheDocument();
  });

  it("should show success message when month is confirmed", async () => {
    mockGetMonths.mockResolvedValue(mockMonths);
    mockPreviewMonth.mockResolvedValue(mockMatches);

    const jsx = await Page({
      searchParams: Promise.resolve({ monthId: "2" }),
    });
    render(jsx);

    expect(
      screen.getByText(
        /Los partidos para este mes ya han sido generados y confirmados/i,
      ),
    ).toBeInTheDocument();
  });

  it("should show matches when month is locked", async () => {
    mockGetMonths.mockResolvedValue(mockMonths);
    mockPreviewMonth.mockResolvedValue(mockMatches);

    const jsx = await Page({
      searchParams: Promise.resolve({ monthId: "1" }),
    });
    render(jsx);

    expect(screen.getByText("Jornada 1")).toBeInTheDocument();
    expect(screen.getByText("Jornada 2")).toBeInTheDocument();

    const categoriaAElements = screen.getAllByText("Categoría A");
    expect(categoriaAElements).toHaveLength(2);

    const categoriaBElements = screen.getAllByText("Categoría B");
    expect(categoriaBElements).toHaveLength(1);
  });

  it("should show players in matches", async () => {
    mockGetMonths.mockResolvedValue(mockMonths);
    mockPreviewMonth.mockResolvedValue(mockMatches);

    const jsx = await Page({
      searchParams: Promise.resolve({ monthId: "1" }),
    });
    render(jsx);

    expect(screen.getByText("J1")).toBeInTheDocument();
    expect(screen.getByText("J2")).toBeInTheDocument();
    expect(screen.getByText("J3")).toBeInTheDocument();
    expect(screen.getByText("Jugador 4")).toBeInTheDocument();
  });

  it("should show confirm button when there are matches", async () => {
    mockGetMonths.mockResolvedValue(mockMonths);
    mockPreviewMonth.mockResolvedValue(mockMatches);

    const jsx = await Page({
      searchParams: Promise.resolve({ monthId: "1" }),
    });
    render(jsx);

    expect(screen.getByTestId("confirm-button")).toBeInTheDocument();
  });

  it("should select current month by default if no monthId", async () => {
    mockGetMonths.mockResolvedValue(mockMonths);
    mockPreviewMonth.mockResolvedValue(mockMatches);
    // Simula que enero (id=1) es el mes actual
    mockGetCurrentMonthId.mockReturnValue(1);

    const jsx = await Page({
      searchParams: Promise.resolve({ monthId: "" }),
    });
    render(jsx);

    expect(mockPreviewMonth).toHaveBeenCalledWith(1);
  });

  it("should use first month if current month doesn't exist", async () => {
    mockGetMonths.mockResolvedValue(mockMonths);
    mockPreviewMonth.mockResolvedValue(mockMatches);
    // getCurrentMonthId no encuentra ningún mes coincidente
    mockGetCurrentMonthId.mockReturnValue(undefined);

    const jsx = await Page({
      searchParams: Promise.resolve({ monthId: "" }),
    });
    render(jsx);

    expect(mockPreviewMonth).toHaveBeenCalledWith(1);
  });

  it("should not call previewMonth when month is not locked or confirmed", async () => {
    mockGetMonths.mockResolvedValue(mockMonths);

    const jsx = await Page({
      searchParams: Promise.resolve({ monthId: "3" }),
    });
    render(jsx);

    expect(mockPreviewMonth).not.toHaveBeenCalled();
  });

  it("should call previewMonth when month is confirmed", async () => {
    mockGetMonths.mockResolvedValue(mockMonths);
    mockPreviewMonth.mockResolvedValue(mockMatches);

    const jsx = await Page({
      searchParams: Promise.resolve({ monthId: "2" }),
    });
    render(jsx);

    expect(mockPreviewMonth).toHaveBeenCalledWith(2);
  });
});