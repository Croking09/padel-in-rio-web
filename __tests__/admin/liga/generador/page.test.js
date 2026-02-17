jest.mock("@/app/actions/generador-partidos", () => ({
  previewMonth: jest.fn(),
}));

jest.mock("@/app/actions/monthly-assignment", () => ({
  getMonths: jest.fn(),
}));

jest.mock("@/components/liga/admin/generador/confirm-button", () => {
  return function ConfirmButton({ monthId }) {
    return <button data-testid="confirm-button">Confirmar ({monthId})</button>;
  };
});

jest.mock("@/components/liga/admin/asignaciones/month-selector", () => {
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
import { getMonths } from "@/app/actions/monthly-assignment";

const mockGetMonths = getMonths;
const mockPreviewMonth = previewMonth;

describe("Match Generator Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMonths = [
    { id: 1, month: 1, year: 2024, status: "locked" },
    { id: 2, month: 2, year: 2024, status: "confirmed" },
    { id: 3, month: 3, year: 2024, status: "draft" },
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
    mockGetMonths.mockResolvedValue([]);

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
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const monthsWithCurrent = [
      { id: 10, month: currentMonth, year: currentYear, status: "locked" },
      ...mockMonths,
    ];

    mockGetMonths.mockResolvedValue(monthsWithCurrent);
    mockPreviewMonth.mockResolvedValue(mockMatches);

    const jsx = await Page({
      searchParams: Promise.resolve({ monthId: "" }),
    });
    render(jsx);

    expect(mockPreviewMonth).toHaveBeenCalledWith(10);
  });

  it("should use first month if current month doesn't exist", async () => {
    mockGetMonths.mockResolvedValue(mockMonths);
    mockPreviewMonth.mockResolvedValue(mockMatches);

    const jsx = await Page({
      searchParams: Promise.resolve({ monthId: "" }),
    });
    render(jsx);

    expect(mockPreviewMonth).toHaveBeenCalledWith(1);
  });

  it("should not call previewMonth when month is not locked", async () => {
    mockGetMonths.mockResolvedValue(mockMonths);

    const jsx = await Page({
      searchParams: Promise.resolve({ monthId: "3" }),
    });
    render(jsx);

    expect(mockPreviewMonth).not.toHaveBeenCalled();
  });
});
