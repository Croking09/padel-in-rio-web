import { render, screen } from "@testing-library/react";
import ResultsView from "@/components/liga/partidos/resultados/results-view";

const makePlayer = (id, full_name, nickname) => ({
  id,
  full_name,
  nickname: nickname ?? null,
});

const mockSets = [
  {
    orden: 1,
    pareja1_juegos: 6,
    pareja2_juegos: 3,
    pareja1: [makePlayer("1", "Carlos García", "Carlitos"), makePlayer("2", "Luis Pérez")],
    pareja2: [makePlayer("3", "Ana Martín", "Anita"), makePlayer("4", "María López")],
  },
  {
    orden: 2,
    pareja1_juegos: 4,
    pareja2_juegos: 6,
    pareja1: [makePlayer("1", "Carlos García", "Carlitos"), makePlayer("2", "Luis Pérez")],
    pareja2: [makePlayer("3", "Ana Martín", "Anita"), makePlayer("4", "María López")],
  },
];

describe("ResultsView", () => {
  it("Shows the title", () => {
      render(<ResultsView sets={[]} />);
      expect(
        screen.queryByText("Resultados del partido")
      ).not.toBeInTheDocument();
    });

  it("Shows a message when there are no results", () => {
      render(<ResultsView sets={[]} />);
      expect(
        screen.getByText("No hay resultados registrados")
      ).toBeInTheDocument();
    });

  describe("Set results available", () => {
    beforeEach(() => {
      render(<ResultsView sets={mockSets} />);
    });

    it("Renders a card for each set", () => {
      expect(screen.getByText("Set 1")).toBeInTheDocument();
      expect(screen.getByText("Set 2")).toBeInTheDocument();
    });

    it("Shows scores for each team in each set", () => {
      const scores = screen.getAllByText(/^[0-9]+$/);
      const scoreValues = scores.map((el) => el.textContent);
      expect(scoreValues).toEqual(expect.arrayContaining(["6", "3", "4", "6"]));
    });

    it("Shows nickname if available", () => {
      render(<ResultsView sets={[mockSets[0]]} />);
      expect(screen.getAllByText("Carlitos").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Anita").length).toBeGreaterThan(0);
    });

    it("Shows full_name if no nickname", () => {
      render(<ResultsView sets={[mockSets[0]]} />);
      expect(screen.getAllByText("Luis Pérez").length).toBeGreaterThan(0);
      expect(screen.getAllByText("María López").length).toBeGreaterThan(0);
    });

    it("Doesnt show full_name if there is a nickname", () => {
      render(<ResultsView sets={[mockSets[0]]} />);
      expect(screen.queryByText("Carlos García")).not.toBeInTheDocument();
      expect(screen.queryByText("Ana Martín")).not.toBeInTheDocument();
    });
  });
});