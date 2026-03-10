jest.mock("react-dnd", () => ({
  DndProvider: ({ children }) => (
    <div data-testid="dnd-provider">{children}</div>
  ),
  useDrag: () => [{}, () => {}],
  useDrop: () => [{ isOver: false, canDrop: false }, () => {}],
}));

jest.mock("react-dnd-html5-backend", () => ({
  HTML5Backend: {},
}));

jest.mock("react-dnd-multi-backend", () => ({
  MultiBackend: {},
  TouchTransition: {},
  MouseTransition: {},
}));

jest.mock("react-dnd-touch-backend", () => ({
  TouchBackend: {},
}));

import { render, screen } from "@testing-library/react";
import AssignmentBoard from "@/components/liga/admin/asignaciones/assignment-board";
import {
  saveAssignments,
  confirmMonth,
} from "@/app/actions/monthly-assignment";

jest.mock("@/app/actions/monthly-assignment", () => ({
  saveAssignments: jest.fn(),
  confirmMonth: jest.fn(),
}));

jest.mock("@/components/liga/admin/asignaciones/player-card", () => {
  return function PlayerCard({ player, isDraggable, assignmentId }) {
    return (
      <div
        data-testid={`player-card-${player.id}`}
        data-draggable={isDraggable}
        data-assignment-id={assignmentId}
      >
        {player.name}
      </div>
    );
  };
});

const mockSaveAssignments = saveAssignments;
const mockConfirmMonth = confirmMonth;

describe("AssignmentBoard", () => {
  const mockPlayers = [
    { id: 1, name: "Jugador 1" },
    { id: 2, name: "Jugador 2" },
    { id: 3, name: "Jugador 3" },
    { id: 4, name: "Jugador 4" },
    { id: 5, name: "Jugador 5" },
  ];

  const mockCategories = [
    { id: 1, name: "Categoría A" },
    { id: 2, name: "Categoría B" },
  ];

  const createMockData = (assignments = [], status = "draft") => ({
    players: mockPlayers,
    categories: mockCategories,
    assignments,
    status,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
  });

  describe("Initial rendering", () => {
    it("should render the board correctly", () => {
      const mockData = createMockData();

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      expect(screen.getByText("Sin Asignar (5)")).toBeInTheDocument();
      expect(screen.getByText("Categoría A")).toBeInTheDocument();
      expect(screen.getByText("Categoría B")).toBeInTheDocument();
    });

    it("should show all players without assignments initially", () => {
      const mockData = createMockData();

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      mockPlayers.forEach((player) => {
        expect(
          screen.getByTestId(`player-card-${player.id}`),
        ).toBeInTheDocument();
      });
    });

    it("should show action buttons when not blocked", () => {
      const mockData = createMockData();

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      expect(screen.getByText("Guardar Borrador")).toBeInTheDocument();
      expect(screen.getByText("Confirmar y Cerrar")).toBeInTheDocument();
    });

    it("should show 'No changes pending' initially", () => {
      const mockData = createMockData();

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      expect(screen.getByText("Sin cambios pendientes")).toBeInTheDocument();
    });

    it("should show the player count for each category", () => {
      const mockData = createMockData([
        { id: 1, jugador_id: 1, categoria_id: 1 },
        { id: 2, jugador_id: 2, categoria_id: 1 },
      ]);

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      const categoryAHeader = screen.getByText("Categoría A").closest(".p-3");
      expect(categoryAHeader).toHaveTextContent("2/8");

      const categoryBHeader = screen.getByText("Categoría B").closest(".p-3");
      expect(categoryBHeader).toHaveTextContent("0/8");
    });
  });

  describe("Blocked state", () => {
    it("should show 'Month Closed' when the month is blocked", () => {
      const mockData = createMockData([], "locked");

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      expect(screen.getByText("Mes Cerrado")).toBeInTheDocument();
    });

    it("should not show action buttons when blocked", () => {
      const mockData = createMockData([], "locked");

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      expect(screen.queryByText("Guardar Borrador")).not.toBeInTheDocument();
      expect(screen.queryByText("Confirmar y Cerrar")).not.toBeInTheDocument();
    });

    it("should mark cards as non-draggable when blocked", () => {
      const mockData = createMockData([], "locked");

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      mockPlayers.forEach((player) => {
        const card = screen.getByTestId(`player-card-${player.id}`);
        expect(card).toHaveAttribute("data-draggable", "false");
      });
    });
  });

  describe("Category validation", () => {
    it("should mark as invalid if a category does not have 8 players", () => {
      const mockData = createMockData([
        { id: 1, jugador_id: 1, categoria_id: 1 },
        { id: 2, jugador_id: 2, categoria_id: 1 },
      ]);

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      expect(screen.getByText(/Cantidad errónea en:/)).toBeInTheDocument();
      expect(screen.getByText(/Categoría A, Categoría B/)).toBeInTheDocument();
    });

    it("should mark as valid when all categories have 8 players", () => {
      const assignments = [
        ...Array.from({ length: 8 }, (_, i) => ({
          id: i + 1,
          jugador_id: i + 1,
          categoria_id: 1,
        })),
        ...Array.from({ length: 8 }, (_, i) => ({
          id: i + 9,
          jugador_id: i + 9,
          categoria_id: 2,
        })),
      ];

      const players = Array.from({ length: 16 }, (_, i) => ({
        id: i + 1,
        name: `Jugador ${i + 1}`,
      }));

      const mockData = {
        players,
        categories: mockCategories,
        assignments,
        status: "draft",
      };

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      expect(
        screen.queryByText(/Cantidad errónea en:/),
      ).not.toBeInTheDocument();
    });

    it("should disable the save button when invalid", () => {
      const mockData = createMockData([
        { id: 1, jugador_id: 1, categoria_id: 1 },
      ]);

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      const saveButton = screen.getByText("Guardar Borrador");
      expect(saveButton).toBeDisabled();
    });

    it("should disable the confirm button when invalid", () => {
      const mockData = createMockData([
        { id: 1, jugador_id: 1, categoria_id: 1 },
      ]);

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      const confirmButton = screen.getByText("Confirmar y Cerrar");
      expect(confirmButton).toBeDisabled();
    });
  });

  describe("Change management", () => {
    it("should disable the save button when no changes", () => {
      const mockData = createMockData();

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      const saveButton = screen.getByText("Guardar Borrador");
      expect(saveButton).toBeDisabled();
    });

    it("should show 'No changes pending' when no changes", () => {
      const mockData = createMockData();

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      expect(screen.getByText("Sin cambios pendientes")).toBeInTheDocument();
    });
  });

  describe("Saving assignments", () => {
    it("should show alert if trying to save with invalid categories", async () => {
      const mockData = createMockData([
        { id: 1, jugador_id: 1, categoria_id: 1 },
      ]);

      const { rerender } = render(
        <AssignmentBoard initialData={mockData} monthId={1} />,
      );

      const newData = createMockData([
        { id: 1, jugador_id: 1, categoria_id: 1 },
        { id: 2, jugador_id: 2, categoria_id: 1 },
      ]);

      rerender(<AssignmentBoard initialData={newData} monthId={1} />);

      const saveButton = screen.getByText("Guardar Borrador");

      expect(saveButton).toBeDisabled();
    });

    it("should call saveAssignments with correct data", async () => {
      mockSaveAssignments.mockResolvedValue();

      const assignments = [
        ...Array.from({ length: 8 }, (_, i) => ({
          id: i + 1,
          jugador_id: i + 1,
          categoria_id: 1,
        })),
        ...Array.from({ length: 8 }, (_, i) => ({
          id: i + 9,
          jugador_id: i + 9,
          categoria_id: 2,
        })),
      ];

      const players = Array.from({ length: 16 }, (_, i) => ({
        id: i + 1,
        name: `Jugador ${i + 1}`,
      }));

      const mockData = {
        players,
        categories: mockCategories,
        assignments,
        status: "draft",
      };

      render(<AssignmentBoard initialData={mockData} monthId={5} />);

      expect(mockSaveAssignments).not.toHaveBeenCalled();
    });

    it("should show loading spinner while saving", async () => {
      mockSaveAssignments.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      const assignments = Array.from({ length: 16 }, (_, i) => ({
        id: i + 1,
        jugador_id: i + 1,
        categoria_id: i < 8 ? 1 : 2,
      }));

      const players = Array.from({ length: 16 }, (_, i) => ({
        id: i + 1,
        name: `Jugador ${i + 1}`,
      }));

      const mockData = {
        players,
        categories: mockCategories,
        assignments,
        status: "draft",
      };

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      expect(screen.getByText("Guardar Borrador")).toBeInTheDocument();
    });

    it("should show error if saving fails", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      mockSaveAssignments.mockRejectedValue(new Error("Network error"));

      expect(mockSaveAssignments).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Confirming month", () => {
    it("should show alert if trying to confirm with invalid categories", async () => {
      const mockData = createMockData([
        { id: 1, jugador_id: 1, categoria_id: 1 },
      ]);

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      const confirmButton = screen.getByText("Confirmar y Cerrar");
      expect(confirmButton).toBeDisabled();
    });

    it("should call saveAssignments and confirmMonth when confirming", async () => {
      mockSaveAssignments.mockResolvedValue();
      mockConfirmMonth.mockResolvedValue();

      const assignments = Array.from({ length: 16 }, (_, i) => ({
        id: i + 1,
        jugador_id: i + 1,
        categoria_id: i < 8 ? 1 : 2,
      }));

      const players = Array.from({ length: 16 }, (_, i) => ({
        id: i + 1,
        name: `Jugador ${i + 1}`,
      }));

      const mockData = {
        players,
        categories: mockCategories,
        assignments,
        status: "draft",
      };

      render(<AssignmentBoard initialData={mockData} monthId={3} />);

      expect(mockSaveAssignments).not.toHaveBeenCalled();
      expect(mockConfirmMonth).not.toHaveBeenCalled();
    });
  });

  describe("Empty slots in categories", () => {
    it("should show empty slots for missing players", () => {
      const mockData = createMockData([
        { id: 1, jugador_id: 1, categoria_id: 1 },
        { id: 2, jugador_id: 2, categoria_id: 1 },
      ]);

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      const freeSlots = screen.getAllByText("Cupo libre");

      expect(freeSlots.length).toBe(14);
    });

    it("should show '—' in empty slots when blocked", () => {
      const mockData = createMockData([], "locked");

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      const emptySlots = screen.getAllByText("—");

      expect(emptySlots.length).toBe(16);
    });
  });

  describe("Resetting state on initialData change", () => {
    it("should reset data when initialData changes", () => {
      const mockData1 = createMockData([
        { id: 1, jugador_id: 1, categoria_id: 1 },
      ]);

      const { rerender } = render(
        <AssignmentBoard initialData={mockData1} monthId={1} />,
      );

      expect(screen.getByText("Sin Asignar (4)")).toBeInTheDocument();

      const mockData2 = createMockData([
        { id: 1, jugador_id: 1, categoria_id: 1 },
        { id: 2, jugador_id: 2, categoria_id: 1 },
      ]);

      rerender(<AssignmentBoard initialData={mockData2} monthId={1} />);

      expect(screen.getByText("Sin Asignar (3)")).toBeInTheDocument();
    });

    it("should reset hasChanges when initialData changes", () => {
      const mockData1 = createMockData();

      const { rerender } = render(
        <AssignmentBoard initialData={mockData1} monthId={1} />,
      );

      const mockData2 = createMockData([
        { id: 1, jugador_id: 1, categoria_id: 1 },
      ]);

      rerender(<AssignmentBoard initialData={mockData2} monthId={1} />);

      expect(screen.getByText("Sin cambios pendientes")).toBeInTheDocument();
    });
  });

  describe("Assigned players", () => {
    it("should show players assigned to the correct category", () => {
      const mockData = createMockData([
        { id: 1, jugador_id: 1, categoria_id: 1 },
        { id: 2, jugador_id: 2, categoria_id: 2 },
      ]);

      render(<AssignmentBoard initialData={mockData} monthId={1} />);

      expect(screen.getByText("Sin Asignar (3)")).toBeInTheDocument();

      const categoryAHeader = screen.getByText("Categoría A").closest(".p-3");
      expect(categoryAHeader).toHaveTextContent("1/8");

      const categoryBHeader = screen.getByText("Categoría B").closest(".p-3");
      expect(categoryBHeader).toHaveTextContent("1/8");
    });
  });
});
