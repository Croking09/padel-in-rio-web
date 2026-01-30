import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Form from "@/components/torneos/inscripcion/form";

jest.mock("@/app/actions/torneos", () => ({
  inscribirTorneo: jest.fn(),
}));

import { inscribirTorneo } from "@/app/actions/torneos";

describe("Inscripcion Form", () => {
  test("all fields should show", () => {
    render(<Form torneo_id="1" categories={["masculino", "femenino"]} />);

    const player1Input = screen.getByLabelText("Jugador 1");
    const player2Input = screen.getByLabelText("Jugador 2");
    const phoneInput = screen.getByLabelText("Teléfono de Contacto");
    const categorySelect = screen.getByLabelText("Categoría");

    expect(player1Input).toBeInTheDocument();
    expect(player2Input).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
    expect(categorySelect).toBeInTheDocument();
  });

  test("categories field doesn't show if there are no categories", () => {
    render(<Form torneo_id="1" categories={null} />);

    const player1Input = screen.getByLabelText("Jugador 1");
    const player2Input = screen.getByLabelText("Jugador 2");
    const phoneInput = screen.getByLabelText("Teléfono de Contacto");
    const categorySelect = screen.queryByLabelText("Categoría");

    expect(player1Input).toBeInTheDocument();
    expect(player2Input).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
    expect(categorySelect).not.toBeInTheDocument();
  });

  test("inscribirTorneo is called when submitting the form", async () => {
    render(<Form torneo_id="1" categories={null} />);

    fireEvent.change(screen.getByLabelText("Jugador 1"), {
      target: { value: "Jugador Uno" },
    });
    fireEvent.change(screen.getByLabelText("Jugador 2"), {
      target: { value: "Jugador Dos" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono de Contacto"), {
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

    expect(inscribirTorneo).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(FormData),
      false,
    );
  });

  test("shows success feedback when inscripcion is successful", async () => {
    inscribirTorneo.mockImplementation(() => ({
      message: "Inscripción completada",
      error: "",
      success: true,
    }));

    render(<Form torneo_id="1" categories={null} />);

    fireEvent.change(screen.getByLabelText("Jugador 1"), {
      target: { value: "Jugador Uno" },
    });
    fireEvent.change(screen.getByLabelText("Jugador 2"), {
      target: { value: "Jugador Dos" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono de Contacto"), {
      target: { value: "600000000" },
    });

    const submitButton = screen.getByRole("button", {
      name: /Confirmar Inscripción/i,
    });
    const form = submitButton.closest("form");
    await act(async () => {
      fireEvent.submit(form);
    });

    const successMessage = await screen.findByText("Inscripción completada");
    expect(successMessage).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /Confirmar Inscripción/i }),
    ).not.toBeInTheDocument();
  });

  test("shows error feedback when inscripcion fails", async () => {
    inscribirTorneo.mockImplementation(() => ({
      message: "",
      error: "Fallo en la inscripción",
      success: false,
    }));

    render(<Form torneo_id="1" categories={null} />);

    fireEvent.change(screen.getByLabelText("Jugador 1"), {
      target: { value: "Jugador Uno" },
    });
    fireEvent.change(screen.getByLabelText("Jugador 2"), {
      target: { value: "Jugador Dos" },
    });
    fireEvent.change(screen.getByLabelText("Teléfono de Contacto"), {
      target: { value: "600000000" },
    });

    const submitButton = screen.getByRole("button", {
      name: /Confirmar Inscripción/i,
    });
    const form = submitButton.closest("form");
    await act(async () => {
      fireEvent.submit(form);
    });

    const errorMessage = await screen.findByText("Fallo en la inscripción");
    expect(errorMessage).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Confirmar Inscripción/i }),
    ).toBeInTheDocument();
  });
});
