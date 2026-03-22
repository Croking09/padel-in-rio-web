import { render, screen } from "@testing-library/react";
import { PlayerRow } from "@/components/liga/ascensor/player-row";

const basePlayer = {
  player_id: 1,
  nickname: "Iván",
  full_name: "Iván García",
  points: 10,
  diff: 3,
  games_for: 8,
};

function renderRow(
  overrides = {},
  props = {},
) {
  const player = { ...basePlayer, ...overrides };
  const { index = 0, categoryId = 2, zebra = false } = props;

  return render(
    <table>
      <tbody>
        <PlayerRow
          player={player}
          index={index}
          categoryId={categoryId}
          zebra={zebra}
        />
      </tbody>
    </table>,
  );
}

function getRowClass(container) {
  return container.querySelector("tr")?.className ?? "";
}

describe("PlayerRow", () => {
  describe("nombre del jugador", () => {
    it("muestra el nickname si está disponible", () => {
      renderRow({ nickname: "Iván" });
      expect(screen.getByText("Iván")).toBeInTheDocument();
    });

    it("muestra el full_name si no hay nickname", () => {
      renderRow({ nickname: null, full_name: "Iván García" });
      expect(screen.getByText("Iván García")).toBeInTheDocument();
    });
  });

  describe("posición", () => {
    it("muestra el número de posición (1-based)", () => {
      renderRow({}, { index: 3 });
      expect(screen.getByText("4")).toBeInTheDocument();
    });
  });

  describe("puntos", () => {
    it("muestra los puntos del jugador", () => {
      renderRow({ points: 15 });
      expect(screen.getByText("15")).toBeInTheDocument();
    });
  });

  describe("diferencia", () => {
    it("muestra la diferencia positiva con prefijo +", () => {
      renderRow({ diff: 5 });
      expect(screen.getByText("+5")).toBeInTheDocument();
    });

    it("muestra la diferencia negativa sin prefijo", () => {
      renderRow({ diff: -3 });
      expect(screen.getByText("-3")).toBeInTheDocument();
    });

    it("muestra 0 sin prefijo", () => {
      renderRow({ diff: 0 });
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  describe("highlight verde (top 3)", () => {
    it("aplica el gradiente verde en posiciones 0, 1, 2 para categorías intermedias", () => {
      [0, 1, 2].forEach((index) => {
        const { container } = renderRow({}, { index, categoryId: 3 });
        expect(getRowClass(container)).toMatch(/22c55e/);
      });
    });

    it("NO aplica el gradiente verde en posición 3", () => {
      const { container } = renderRow({}, { index: 3, categoryId: 3 });
      expect(getRowClass(container)).not.toMatch(/22c55e/);
    });

    it("NO aplica el gradiente verde en 1ª categoría aunque esté en top 3", () => {
      const { container } = renderRow({}, { index: 0, categoryId: 1 });
      expect(getRowClass(container)).not.toMatch(/22c55e/);
    });
  });

  describe("highlight rojo (bottom 3)", () => {
    it("aplica el gradiente rojo en posiciones 5, 6, 7 para categorías intermedias", () => {
      [5, 6, 7].forEach((index) => {
        const { container } = renderRow({}, { index, categoryId: 3 });
        expect(getRowClass(container)).toMatch(/ef4444/);
      });
    });

    it("NO aplica el gradiente rojo en posición 4", () => {
      const { container } = renderRow({}, { index: 4, categoryId: 3 });
      expect(getRowClass(container)).not.toMatch(/ef4444/);
    });

    it("NO aplica el gradiente rojo en 5ª categoría aunque esté en bottom 3", () => {
      const { container } = renderRow({}, { index: 7, categoryId: 5 });
      expect(getRowClass(container)).not.toMatch(/ef4444/);
    });
  });

  describe("zebra striping", () => {
    it("aplica bg-primary/20 cuando zebra es true", () => {
      const { container } = renderRow({}, { zebra: true });
      expect(getRowClass(container)).toMatch(/bg-primary\/20/);
    });

    it("aplica bg-background cuando zebra es false", () => {
      const { container } = renderRow({}, { zebra: false });
      expect(getRowClass(container)).toMatch(/bg-background/);
    });
  });
});