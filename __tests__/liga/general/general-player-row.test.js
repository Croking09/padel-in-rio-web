import { render, screen } from "@testing-library/react";
import { GeneralPlayerRow } from "@/components/liga/clasificacion-general/general-player-row";

const basePlayer = {
  player_id: 1,
  nickname: "Manolito",
  full_name: "Manolito García",
  points: 26,
  diff: 9,
  games_for: 18,
  matches_played: 6,
};

describe("GeneralPlayerRow", () => {
  it("muestra el nickname si existe", () => {
    render(
      <table><tbody>
        <GeneralPlayerRow player={basePlayer} index={0} zebra={true} />
      </tbody></table>
    );
    expect(screen.getByText("Manolito")).toBeInTheDocument();
  });

  it("muestra el full_name si no hay nickname", () => {
    render(
      <table><tbody>
        <GeneralPlayerRow player={{ ...basePlayer, nickname: null }} index={0} zebra={true} />
      </tbody></table>
    );
    expect(screen.getByText("Manolito García")).toBeInTheDocument();
  });

  it("muestra el índice + 1 como posición", () => {
    render(
      <table><tbody>
        <GeneralPlayerRow player={basePlayer} index={2} zebra={false} />
      </tbody></table>
    );
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("muestra diff positivo con símbolo +", () => {
    render(
      <table><tbody>
        <GeneralPlayerRow player={basePlayer} index={0} zebra={false} />
      </tbody></table>
    );
    expect(screen.getByText("+9")).toBeInTheDocument();
  });

  it("muestra diff negativo sin símbolo +", () => {
    render(
      <table><tbody>
        <GeneralPlayerRow player={{ ...basePlayer, diff: -3 }} index={0} zebra={false} />
      </tbody></table>
    );
    expect(screen.getByText("-3")).toBeInTheDocument();
  });

  it("aplica clase zebra cuando zebra=true", () => {
    const { container } = render(
      <table><tbody>
        <GeneralPlayerRow player={basePlayer} index={0} zebra={true} />
      </tbody></table>
    );
    expect(container.querySelector("tr")).toHaveClass("bg-primary/20");
  });

  it("no aplica clase zebra cuando zebra=false", () => {
    const { container } = render(
      <table><tbody>
        <GeneralPlayerRow player={basePlayer} index={0} zebra={false} />
      </tbody></table>
    );
    expect(container.querySelector("tr")).toHaveClass("bg-background");
  });

  it("muestra points, games_for y matches_played", () => {
    render(
      <table><tbody>
        <GeneralPlayerRow player={basePlayer} index={0} zebra={false} />
      </tbody></table>
    );
    expect(screen.getByText("26")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
  });
});