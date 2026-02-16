jest.mock("@/app/actions/monthly-assignment", () => ({
  getMonths: jest.fn(),
  getAssignmentData: jest.fn(),
}));

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
import { getMonths, getAssignmentData } from "@/app/actions/monthly-assignment";

const mockGetMonths = getMonths;
const mockGetAssignmentData = getAssignmentData;

describe("AssignmentPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-02-15"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockMonths = [
    { id: 1, month: 1, year: 2024, status: "draft" },
    { id: 2, month: 2, year: 2024, status: "locked" },
    { id: 3, month: 3, year: 2024, status: "confirmed" },
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

  describe("Basic rendering", () => {
    it("should render title", async () => {
      mockGetMonths.mockResolvedValue(mockMonths);
      mockGetAssignmentData.mockResolvedValue(mockAssignmentData);

      const jsx = await AssignmentPage({
        searchParams: Promise.resolve({ monthId: "1" }),
      });
      render(jsx);

      expect(screen.getByText("Asignación de Jugadores")).toBeInTheDocument();
    });

    it("should render month selector", async () => {
      mockGetMonths.mockResolvedValue(mockMonths);
      mockGetAssignmentData.mockResolvedValue(mockAssignmentData);

      const jsx = await AssignmentPage({
        searchParams: Promise.resolve({ monthId: "1" }),
      });
      render(jsx);

      expect(screen.getByTestId("month-selector")).toBeInTheDocument();
    });

    it("should render assignment board", async () => {
      mockGetMonths.mockResolvedValue(mockMonths);
      mockGetAssignmentData.mockResolvedValue(mockAssignmentData);

      const jsx = await AssignmentPage({
        searchParams: Promise.resolve({ monthId: "2" }),
      });
      render(jsx);

      expect(screen.getByTestId("assignment-board")).toBeInTheDocument();
      expect(screen.getByTestId("assignment-board")).toHaveAttribute(
        "data-month-id",
        "2",
      );
    });
  });

  describe("Month selection", () => {
    it("should use monthId from searchParams when present", async () => {
      mockGetMonths.mockResolvedValue(mockMonths);
      mockGetAssignmentData.mockResolvedValue(mockAssignmentData);

      const jsx = await AssignmentPage({
        searchParams: Promise.resolve({ monthId: "3" }),
      });
      render(jsx);

      expect(mockGetAssignmentData).toHaveBeenCalledWith(3);
      expect(screen.getByTestId("assignment-board")).toHaveAttribute(
        "data-month-id",
        "3",
      );
    });

    it("should select current month when no monthId in searchParams", async () => {
      // Fecha del sistema: 2024-02-15 (mes 2)
      mockGetMonths.mockResolvedValue(mockMonths);
      mockGetAssignmentData.mockResolvedValue(mockAssignmentData);

      const jsx = await AssignmentPage({
        searchParams: Promise.resolve({}),
      });
      render(jsx);

      // Debe seleccionar el mes 2 (febrero 2024)
      expect(mockGetAssignmentData).toHaveBeenCalledWith(2);
      expect(screen.getByTestId("assignment-board")).toHaveAttribute(
        "data-month-id",
        "2",
      );
    });

    it("should use first month when current month does not exist in list", async () => {
      // Fecha del sistema: 2024-02-15
      const futureMonths = [
        { id: 10, month: 5, year: 2024, status: "draft" },
        { id: 11, month: 6, year: 2024, status: "draft" },
      ];

      mockGetMonths.mockResolvedValue(futureMonths);
      mockGetAssignmentData.mockResolvedValue(mockAssignmentData);

      const jsx = await AssignmentPage({
        searchParams: Promise.resolve({}),
      });
      render(jsx);

      // No existe febrero, debe usar el primer mes (id: 10)
      expect(mockGetAssignmentData).toHaveBeenCalledWith(10);
      expect(screen.getByTestId("assignment-board")).toHaveAttribute(
        "data-month-id",
        "10",
      );
    });

    it("should convert monthId string to number correctly", async () => {
      mockGetMonths.mockResolvedValue(mockMonths);
      mockGetAssignmentData.mockResolvedValue(mockAssignmentData);

      const jsx = await AssignmentPage({
        searchParams: Promise.resolve({ monthId: "2" }),
      });
      render(jsx);

      expect(mockGetAssignmentData).toHaveBeenCalledWith(2);
      expect(typeof mockGetAssignmentData.mock.calls[0][0]).toBe("number");
    });
  });

  describe("Edge cases", () => {
    it("should show message when no months are configured", async () => {
      mockGetMonths.mockResolvedValue([]);

      const jsx = await AssignmentPage({
        searchParams: Promise.resolve({}),
      });
      render(jsx);

      expect(
        screen.getByText(
          "No hay meses configurados. Por favor crea meses primero.",
        ),
      ).toBeInTheDocument();
      expect(screen.queryByTestId("assignment-board")).not.toBeInTheDocument();
    });

    it("should not call getAssignmentData when no months", async () => {
      mockGetMonths.mockResolvedValue([]);

      const jsx = await AssignmentPage({
        searchParams: Promise.resolve({}),
      });
      render(jsx);

      expect(mockGetAssignmentData).not.toHaveBeenCalled();
    });

    it("should handle invalid monthId using fallback", async () => {
      mockGetMonths.mockResolvedValue(mockMonths);
      mockGetAssignmentData.mockResolvedValue(mockAssignmentData);

      const jsx = await AssignmentPage({
        searchParams: Promise.resolve({ monthId: "invalid" }),
      });
      render(jsx);

      // NaN se convierte en undefined, debe usar el mes actual
      expect(mockGetAssignmentData).toHaveBeenCalledWith(2);
    });

    it("should pass initialData to AssignmentBoard correctly", async () => {
      const customData = {
        categories: [
          {
            id: "cat-custom",
            name: "Custom Category",
            players: [{ id: "99", name: "Custom Player" }],
          },
        ],
        unassignedPlayers: [{ id: "100", name: "Unassigned" }],
      };

      mockGetMonths.mockResolvedValue(mockMonths);
      mockGetAssignmentData.mockResolvedValue(customData);

      const jsx = await AssignmentPage({
        searchParams: Promise.resolve({ monthId: "1" }),
      });
      render(jsx);

      const boardData = screen.getByTestId("board-data");
      expect(boardData.textContent).toBe(JSON.stringify(customData));
    });
  });

  describe("Manejo de años diferentes", () => {
    it("should select correct month from specific year", async () => {
      jest.setSystemTime(new Date("2025-03-20"));

      const months2025 = [
        { id: 20, month: 1, year: 2025, status: "draft" },
        { id: 21, month: 2, year: 2025, status: "draft" },
        { id: 22, month: 3, year: 2025, status: "draft" },
        { id: 23, month: 3, year: 2024, status: "confirmed" }, // mes 3 pero año anterior
      ];

      mockGetMonths.mockResolvedValue(months2025);
      mockGetAssignmentData.mockResolvedValue(mockAssignmentData);

      const jsx = await AssignmentPage({
        searchParams: Promise.resolve({}),
      });
      render(jsx);

      // Debe seleccionar marzo 2025 (id: 22), no marzo 2024
      expect(mockGetAssignmentData).toHaveBeenCalledWith(22);
    });
  });

  describe("Function calls", () => {
    it("should call getMonths exactly once", async () => {
      mockGetMonths.mockResolvedValue(mockMonths);
      mockGetAssignmentData.mockResolvedValue(mockAssignmentData);

      await AssignmentPage({
        searchParams: Promise.resolve({ monthId: "1" }),
      });

      expect(mockGetMonths).toHaveBeenCalledTimes(1);
    });

    it("should call getAssignmentData with correct monthId", async () => {
      mockGetMonths.mockResolvedValue(mockMonths);
      mockGetAssignmentData.mockResolvedValue(mockAssignmentData);

      await AssignmentPage({
        searchParams: Promise.resolve({ monthId: "2" }),
      });

      expect(mockGetAssignmentData).toHaveBeenCalledTimes(1);
      expect(mockGetAssignmentData).toHaveBeenCalledWith(2);
    });
  });
});
