jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/app/actions/partidos", () => ({
  registerMatchResults: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MatchResultsPage from "@/components/liga/admin/resultados/results-form";
import { registerMatchResults } from "@/app/actions/partidos";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const mockRegisterMatchResults = registerMatchResults;
const mockRedirect = redirect;

const mockPlayers = [
  { id: "1", full_name: "Player One", nickname: "P1" },
  { id: "2", full_name: "Player Two", nickname: "P2" },
  { id: "3", full_name: "Player Three", nickname: "P3" },
  { id: "4", full_name: "Player Four", nickname: "P4" },
];

describe("MatchResultsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders 3 sets", () => {
    render(<MatchResultsPage partidoId={1} players={mockPlayers} />);

    expect(screen.getByText("Set 1")).toBeInTheDocument();
    expect(screen.getByText("Set 2")).toBeInTheDocument();
    expect(screen.getByText("Set 3")).toBeInTheDocument();
  });

  it("renders all player nicknames", () => {
    render(<MatchResultsPage partidoId={1} players={mockPlayers} />);

    expect(screen.getAllByText("P1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("P2").length).toBeGreaterThan(0);
    expect(screen.getAllByText("P3").length).toBeGreaterThan(0);
    expect(screen.getAllByText("P4").length).toBeGreaterThan(0);
  });

  it("falls back to full_name if no nickname", () => {
    const playersNoNickname = mockPlayers.map((p) => ({
      ...p,
      nickname: null,
    }));

    render(<MatchResultsPage partidoId={1} players={playersNoNickname} />);

    expect(screen.getAllByText("Player One").length).toBeGreaterThan(0);
  });

  it("redirects if players length is not 4", () => {
    render(<MatchResultsPage partidoId={1} players={mockPlayers.slice(0, 3)} />);

    expect(mockRedirect).toHaveBeenCalledWith("/liga/partidos");
  });

  it("renders inputs empty initially", () => {
    render(<MatchResultsPage partidoId={1} players={mockPlayers} />);

    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toHaveValue("");
    });
  });

  it("allows typing numbers in inputs", () => {
    render(<MatchResultsPage partidoId={1} players={mockPlayers} />);

    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "6" } });

    expect(inputs[0]).toHaveValue("6");
  });

  it("ignores non-numeric input", () => {
    render(<MatchResultsPage partidoId={1} players={mockPlayers} />);

    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "a" } });

    expect(inputs[0]).toHaveValue("");
  });

  it("shows error toast if all results are empty on submit", async () => {
    render(<MatchResultsPage partidoId={1} players={mockPlayers} />);

    fireEvent.click(screen.getByText("Guardar resultados"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "No se han introducido todos los resultados",
        { position: "top-center" },
      );
    });

    expect(mockRegisterMatchResults).not.toHaveBeenCalled();
  });

  it("shows error toast if some sets are missing results", async () => {
    render(<MatchResultsPage partidoId={1} players={mockPlayers} />);

    const inputs = screen.getAllByRole("textbox");
    // Solo rellenamos el primer set
    fireEvent.change(inputs[0], { target: { value: "6" } });
    fireEvent.change(inputs[1], { target: { value: "3" } });

    fireEvent.click(screen.getByText("Guardar resultados"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "No se han introducido todos los resultados",
        { position: "top-center" },
      );
    });
  });

  it("calls registerMatchResults with correct data on valid submit", async () => {
    mockRegisterMatchResults.mockResolvedValue({ success: true });

    render(<MatchResultsPage partidoId={1} players={mockPlayers} />);

    const inputs = screen.getAllByRole("textbox");
    // 6 inputs: p1 y p2 por cada set
    [6, 3, 6, 4, 6, 2].forEach((val, idx) => {
      fireEvent.change(inputs[idx], { target: { value: String(val) } });
    });

    fireEvent.click(screen.getByText("Guardar resultados"));

    await waitFor(() => {
      expect(mockRegisterMatchResults).toHaveBeenCalledWith(
        1,
        expect.arrayContaining([
          expect.objectContaining({ orden: 1, pareja1_juegos: 6, pareja2_juegos: 3 }),
          expect.objectContaining({ orden: 2, pareja1_juegos: 6, pareja2_juegos: 4 }),
          expect.objectContaining({ orden: 3, pareja1_juegos: 6, pareja2_juegos: 2 }),
        ]),
      );
    });
  });

  it("shows success toast and redirects on successful submit", async () => {
    mockRegisterMatchResults.mockResolvedValue({ success: true });

    render(<MatchResultsPage partidoId={1} players={mockPlayers} />);

    const inputs = screen.getAllByRole("textbox");
    [6, 3, 6, 4, 6, 2].forEach((val, idx) => {
      fireEvent.change(inputs[idx], { target: { value: String(val) } });
    });

    fireEvent.click(screen.getByText("Guardar resultados"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Resultados registrados correctamente",
        { position: "top-center" },
      );
      expect(mockRedirect).toHaveBeenCalledWith("/liga/partidos");
    });
  });

  it("shows error toast if registerMatchResults fails", async () => {
    mockRegisterMatchResults.mockResolvedValue({ success: false });

    render(<MatchResultsPage partidoId={1} players={mockPlayers} />);

    const inputs = screen.getAllByRole("textbox");
    [6, 3, 6, 4, 6, 2].forEach((val, idx) => {
      fireEvent.change(inputs[idx], { target: { value: String(val) } });
    });

    fireEvent.click(screen.getByText("Guardar resultados"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Ha ocurrido un error al registrar los resultados",
        { position: "top-center" },
      );
    });

    expect(mockRedirect).not.toHaveBeenCalled();
  });
});