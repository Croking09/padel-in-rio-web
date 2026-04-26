jest.mock("@/app/actions/ligas", () => ({
  getMonths: jest.fn(),
  getTemporadas: jest.fn(),
}));

jest.mock("@/app/actions/monthly-assignment", () => ({
  getAssignmentData: jest.fn(),
}));

jest.mock("@/lib/utils", () => ({
  getCurrentMonthId: jest.fn(),
}));

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

jest.mock("@/components/liga/admin/asignaciones/assignment-board", () => {
  return function AssignmentBoard({ initialData, monthId }) {
    return (
      <div data-testid="assignment-board" data-month-id={monthId}>
        Assignment Board - Month {monthId}
        <div data-testid="board-data">{JSON.stringify(initialData)}</div>
      </div>
    );
  };
});

import { render, screen } from "@testing-library/react";
import AssignmentPage from "@/app/admin/liga/asignacion/page";

import { getMonths, getTemporadas } from "@/app/actions/ligas";
import { getAssignmentData } from "@/app/actions/monthly-assignment";
import { getCurrentMonthId } from "@/lib/utils";

const mockGetMonths = getMonths;
const mockGetTemporadas = getTemporadas;
const mockGetAssignmentData = getAssignmentData;
const mockGetCurrentMonthId = getCurrentMonthId;

const TEMPORADA_ID = 1;

describe("AssignmentPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetTemporadas.mockResolvedValue([{ id: TEMPORADA_ID, name: "2024" }]);
  });

  const mockMonths = [
    { id: 1, month: 1, year: 2024, status: "draft", temporada_id: TEMPORADA_ID },
    { id: 2, month: 2, year: 2024, status: "locked", temporada_id: TEMPORADA_ID },
    { id: 3, month: 3, year: 2024, status: "confirmed", temporada_id: TEMPORADA_ID },
  ];

  const mockAssignmentData = {
    categories: [
      {
        id: "cat-1",
        name: "Categoría A",
        players: [
          { id: "1", name: "Player 1" },
          { id: "2", name: "Player 2" },
        ],
      },
    ],
    unassignedPlayers: [],
  };

  it("should render title", async () => {
    mockGetMonths.mockResolvedValue(mockMonths);
    mockGetAssignmentData.mockResolvedValue(mockAssignmentData);
    mockGetCurrentMonthId.mockReturnValue(undefined);

    const jsx = await AssignmentPage({
      searchParams: Promise.resolve({ monthId: "1" }),
    });

    render(jsx);

    expect(screen.getByText("Asignación de Jugadores")).toBeInTheDocument();
  });

  it("should render month selector", async () => {
    mockGetMonths.mockResolvedValue(mockMonths);
    mockGetAssignmentData.mockResolvedValue(mockAssignmentData);
    mockGetCurrentMonthId.mockReturnValue(undefined);

    const jsx = await AssignmentPage({
      searchParams: Promise.resolve({ monthId: "1" }),
    });

    render(jsx);

    expect(screen.getByTestId("month-selector")).toBeInTheDocument();
  });

  it("should render assignment board", async () => {
    mockGetMonths.mockResolvedValue(mockMonths);
    mockGetAssignmentData.mockResolvedValue(mockAssignmentData);
    mockGetCurrentMonthId.mockReturnValue(undefined);

    const jsx = await AssignmentPage({
      searchParams: Promise.resolve({ monthId: "2" }),
    });

    render(jsx);

    expect(screen.getByTestId("assignment-board")).toBeInTheDocument();
    expect(screen.getByTestId("assignment-board")).toHaveAttribute(
      "data-month-id",
      "2"
    );
  });

  it("should use monthId from searchParams", async () => {
    mockGetMonths.mockResolvedValue(mockMonths);
    mockGetAssignmentData.mockResolvedValue(mockAssignmentData);
    mockGetCurrentMonthId.mockReturnValue(undefined);

    const jsx = await AssignmentPage({
      searchParams: Promise.resolve({ monthId: "3" }),
    });

    render(jsx);

    expect(mockGetAssignmentData).toHaveBeenCalledWith(3);
  });

  it("should select current month if not provided", async () => {
    mockGetMonths.mockResolvedValue(mockMonths);
    mockGetAssignmentData.mockResolvedValue(mockAssignmentData);
    // Simula que febrero (id=2) es el mes actual
    mockGetCurrentMonthId.mockReturnValue(2);

    const jsx = await AssignmentPage({
      searchParams: Promise.resolve({}),
    });

    render(jsx);

    expect(mockGetAssignmentData).toHaveBeenCalledWith(2);
  });

  it("should fallback to first month when no current month matches", async () => {
    const futureMonths = [
      { id: 10, month: 5, year: 2024, status: "draft", temporada_id: TEMPORADA_ID },
      { id: 11, month: 6, year: 2024, status: "draft", temporada_id: TEMPORADA_ID },
    ];

    mockGetMonths.mockResolvedValue(futureMonths);
    mockGetAssignmentData.mockResolvedValue(mockAssignmentData);
    // getCurrentMonthId no encuentra ningún mes coincidente
    mockGetCurrentMonthId.mockReturnValue(undefined);

    const jsx = await AssignmentPage({
      searchParams: Promise.resolve({}),
    });

    render(jsx);

    expect(mockGetAssignmentData).toHaveBeenCalledWith(10);
  });

  it("should show message when no months exist", async () => {
    mockGetMonths.mockResolvedValue([]);
    mockGetCurrentMonthId.mockReturnValue(undefined);

    const jsx = await AssignmentPage({
      searchParams: Promise.resolve({}),
    });

    render(jsx);

    expect(
      screen.getByText(
        "No hay meses confirmados para mostrar."
      )
    ).toBeInTheDocument();
  });

  it("should not call getAssignmentData when no months", async () => {
    mockGetMonths.mockResolvedValue([]);
    mockGetCurrentMonthId.mockReturnValue(undefined);

    const jsx = await AssignmentPage({
      searchParams: Promise.resolve({}),
    });

    render(jsx);

    expect(mockGetAssignmentData).not.toHaveBeenCalled();
  });

  it("should render board data correctly", async () => {
    mockGetMonths.mockResolvedValue(mockMonths);
    mockGetAssignmentData.mockResolvedValue(mockAssignmentData);
    mockGetCurrentMonthId.mockReturnValue(undefined);

    const jsx = await AssignmentPage({
      searchParams: Promise.resolve({ monthId: "1" }),
    });

    render(jsx);

    expect(screen.getByTestId("board-data").textContent).toBe(
      JSON.stringify(mockAssignmentData)
    );
  });
});