import { render, screen } from "@testing-library/react";
import { GeneralTable } from "@/components/liga/clasificacion-general/general-table";

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
  {
    player_id: 3,
    nickname: "Jose",
    full_name: "Jose Martín",
    points: 12,
    diff: -3,
    games_for: 12,
    matches_played: 4,
  },
];

describe("GeneralTable", () => {
  it("renderiza las cabeceras correctamente", () => {
    render(<GeneralTable data={mockData} />);
    expect(screen.getByText("Jugador")).toBeInTheDocument();
    expect(screen.getByText("Pts")).toBeInTheDocument();
    expect(screen.getByText("Dif")).toBeInTheDocument();
    expect(screen.getByText("JG")).toBeInTheDocument();
    expect(screen.getByText("PJ")).toBeInTheDocument();
  });

  it("renderiza todos los jugadores", () => {
    render(<GeneralTable data={mockData} />);
    expect(screen.getByText("Manolito")).toBeInTheDocument();
    expect(screen.getByText("Pepe")).toBeInTheDocument();
    expect(screen.getByText("Jose")).toBeInTheDocument();
  });

  it("renderiza tantas filas como jugadores hay en data", () => {
    const { container } = render(<GeneralTable data={mockData} />);
    const rows = container.querySelectorAll("tbody tr");
    expect(rows).toHaveLength(mockData.length);
  });

  it("renderiza correctamente con un solo jugador", () => {
    render(<GeneralTable data={[mockData[0]]} />);
    expect(screen.getByText("Manolito")).toBeInTheDocument();
  });
});