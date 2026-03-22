import { render, screen } from "@testing-library/react";
import { CategoryTable } from "@/components/liga/ascensor/category-table";

jest.mock("@/components/liga/ascensor/player-row", () => ({
  PlayerRow: ({
    player,
    index,
    zebra,
  }) => (
    <tr data-testid={`player-row-${player.player_id}`} data-index={index} data-zebra={zebra}>
      <td>{index + 1}</td>
      <td>{player.nickname ?? player.full_name}</td>
      <td>{player.points}</td>
      <td>{player.diff}</td>
      <td>{player.games_for}</td>
    </tr>
  ),
}));

const makePlayers = (count) =>
  Array.from({ length: count }, (_, i) => ({
    player_id: i + 1,
    nickname: `Jugador ${i + 1}`,
    full_name: `Jugador Apellido ${i + 1}`,
    points: (count - i) * 10,
    diff: count - i,
    games_for: count - i,
  }));

const baseData = {
  category: { id: 3, name: "3ª" },
  classification: makePlayers(8),
};

describe("CategoryTable", () => {
  describe("cabecera", () => {
    it("muestra el nombre de la categoría", () => {
      render(<CategoryTable data={baseData} />);
      expect(screen.getByText("3ª")).toBeInTheDocument();
    });

    it("muestra todas las columnas", () => {
      render(<CategoryTable data={baseData} />);
      expect(screen.getByText("#")).toBeInTheDocument();
      expect(screen.getByText("Jugador")).toBeInTheDocument();
      expect(screen.getByText("Pts")).toBeInTheDocument();
      expect(screen.getByText("Dif")).toBeInTheDocument();
      expect(screen.getByText("JG")).toBeInTheDocument();
    });
  });

  describe("filas de jugadores", () => {
    it("renderiza una fila por jugador", () => {
      render(<CategoryTable data={baseData} />);
      baseData.classification.forEach((p) => {
        expect(screen.getByTestId(`player-row-${p.player_id}`)).toBeInTheDocument();
      });
    });

    it("ordena los jugadores por puntos de mayor a menor", () => {
      const fillers = Array.from({ length: 5 }, (_, i) => ({
        player_id: i + 10,
        nickname: `Extra ${i}`,
        full_name: "",
        points: 0,
        diff: 0,
        games_for: 0,
      }));
      const unordered = {
        ...baseData,
        classification: [
          { player_id: 1, nickname: "Bajo",  full_name: "", points: 5,  diff: 0, games_for: 0 },
          { player_id: 2, nickname: "Alto",  full_name: "", points: 20, diff: 0, games_for: 0 },
          { player_id: 3, nickname: "Medio", full_name: "", points: 10, diff: 0, games_for: 0 },
          ...fillers,
        ],
      };
      render(<CategoryTable data={unordered} />);
      const rows = screen.getAllByRole("row").slice(1); // omitir thead
      expect(rows[0]).toHaveTextContent("Alto");
      expect(rows[1]).toHaveTextContent("Medio");
      expect(rows[2]).toHaveTextContent("Bajo");
    });

    it("desempata por diferencia cuando los puntos son iguales", () => {
      const fillers = Array.from({ length: 6 }, (_, i) => ({
        player_id: i + 10,
        nickname: `Extra ${i}`,
        full_name: "",
        points: 0,
        diff: 0,
        games_for: 0,
      }));
      const tied = {
        ...baseData,
        classification: [
          { player_id: 1, nickname: "MejorDif", full_name: "", points: 10, diff: 5, games_for: 0 },
          { player_id: 2, nickname: "PeorDif",  full_name: "", points: 10, diff: 1, games_for: 0 },
          ...fillers,
        ],
      };
      render(<CategoryTable data={tied} />);
      const rows = screen.getAllByRole("row").slice(1);
      expect(rows[0]).toHaveTextContent("MejorDif");
      expect(rows[1]).toHaveTextContent("PeorDif");
    });

    it("pasa zebra=true a filas pares y zebra=false a filas impares", () => {
      render(<CategoryTable data={baseData} />);
      const rows = screen.getAllByRole("row").slice(1);
      rows.forEach((row, i) => {
        expect(row).toHaveAttribute("data-zebra", i % 2 === 0 ? "true" : "false");
      });
    });

    it("pasa el index correcto a cada PlayerRow", () => {
      render(<CategoryTable data={baseData} />);
      const rows = screen.getAllByRole("row").slice(1);
      rows.forEach((row, i) => {
        expect(row).toHaveAttribute("data-index", String(i));
      });
    });
  });
});