import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Form from "@/components/torneos/inscripcion/form";

jest.mock("@/app/actions/inscripciones", () => ({
  inscribirTorneo: jest.fn(),
}));

import { inscribirTorneo } from "@/app/actions/inscripciones";

describe("Inscripcion Form", () => {
  test("all fields should show", () => {
    render(<Form torneo_id={1} categories={["masculino", "femenino"]} />);

    const player1Input = screen.getByLabelText(/jugador 1/i);
    const player2Input = screen.getByLabelText(/jugador 2/i);
    const phoneInput = screen.getByLabelText(/Teléfono de Contacto/i);
    const categorySelect = screen.getByLabelText(/Categoría/i);

    expect(player1Input).toBeInTheDocument();
    expect(player2Input).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
    expect(categorySelect).toBeInTheDocument();
  });

  test("categories field doesn't show if there are no categories", () => {
    render(<Form torneo_id={1} categories={null} />);

    const player1Input = screen.getByLabelText(/jugador 1/i);
    const player2Input = screen.getByLabelText(/jugador 2/i);
    const phoneInput = screen.getByLabelText(/Teléfono de Contacto/i);
    const categorySelect = screen.queryByLabelText(/categoría/i);

    expect(player1Input).toBeInTheDocument();
    expect(player2Input).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
    expect(categorySelect).not.toBeInTheDocument();
  });

  test("inscribirTorneo is called when submitting the form", async () => {
    inscribirTorneo.mockResolvedValue({ success: true });

    render(<Form torneo_id={1} categories={null} />);

    fireEvent.change(screen.getByLabelText(/jugador 1/i), {
      target: { value: "Jugador Uno" },
    });
    fireEvent.change(screen.getByLabelText(/jugador 2/i), {
      target: { value: "Jugador Dos" },
    });
    fireEvent.change(screen.getByLabelText(/Teléfono de Contacto/i), {
      target: { value: "600000000" },
    });

    const submitButton = screen.getByRole("button", {
      name: /Confirmar Inscripción/i,
    });
    const form = submitButton.closest("form");

    await act(async () => {
      fireEvent.submit(form);
    });

    expect(inscribirTorneo).toHaveBeenCalled();

    expect(inscribirTorneo).toHaveBeenCalledWith({
      torneo_id: 1,
      player_1_full_name: "Jugador Uno",
      player_2_full_name: "Jugador Dos",
      phone_number: "600000000",
      category: null,
    }, false);
  });
});
