import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateTorneoForm from "@/components/torneos/admin/create-torneo-form";

jest.mock("@/app/actions/torneos", () => ({
  createTorneo: jest.fn(),
}));

import { createTorneo } from "@/app/actions/torneos";

describe("Create Torneo Form", () => {
  test("all fields should show", () => {
    render(<CreateTorneoForm />);

    const nameInput = screen.getByLabelText(/Nombre/i);
    const cartelInput = screen.getByLabelText(/cartel/i);
    const descriptionInput = screen.getByLabelText("Descripción");
    const categoriesInput = screen.getByLabelText(/categorías/i);
    const addNewCategoryButton = screen.getByRole("button", { name: "Añadir" });
    const startDateInput = screen.getByLabelText(/fecha de inicio/i);
    const endDateInput = screen.getByLabelText(/fecha de fin/i);
    const inscriptionEndDateInput = screen.getByLabelText(/cierre de inscripciones/i);
    const submitButton = screen.getByRole("button", { name: "Crear Torneo" });

    expect(nameInput).toBeInTheDocument();
    expect(cartelInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(categoriesInput).toBeInTheDocument();
    expect(addNewCategoryButton).toBeInTheDocument();
    expect(startDateInput).toBeInTheDocument();
    expect(endDateInput).toBeInTheDocument();
    expect(inscriptionEndDateInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test("add category should work", () => {
    render(<CreateTorneoForm />);

    const categoriesInput = screen.getByLabelText(/categorías/i);
    const addNewCategoryButton = screen.getByRole("button", { name: "Añadir" });

    fireEvent.change(categoriesInput, { target: { value: "1ª Masculina" } });
    fireEvent.click(addNewCategoryButton);

    fireEvent.change(categoriesInput, { target: { value: "2ª Masculina" } });
    fireEvent.click(addNewCategoryButton);

    expect(screen.getByText("1ª Masculina")).toBeInTheDocument();
    expect(screen.getByText("2ª Masculina")).toBeInTheDocument();
  });

  test("remove category should work", () => {
    render(<CreateTorneoForm />);

    const categoriesInput = screen.getByLabelText(/categorías/i);
    const addNewCategoryButton = screen.getByRole("button", { name: "Añadir" });

    fireEvent.change(categoriesInput, { target: { value: "1ª Masculina" } });
    fireEvent.click(addNewCategoryButton);

    fireEvent.change(categoriesInput, { target: { value: "2ª Masculina" } });
    fireEvent.click(addNewCategoryButton);

    const removeCategoryButton = screen.getByTestId("remove-category-1");
    fireEvent.click(removeCategoryButton);

    expect(screen.getByText("1ª Masculina")).toBeInTheDocument();
    expect(screen.queryByText("2ª Masculina")).not.toBeInTheDocument();
  });

  test("submit should work", async () => {
    createTorneo.mockResolvedValue({ success: true });

    render(<CreateTorneoForm />);

    const nameInput = screen.getByLabelText(/Nombre/i);
    const descriptionInput = screen.getByLabelText("Descripción");
    const categoriesInput = screen.getByLabelText(/categorías/i);
    const addNewCategoryButton = screen.getByRole("button", { name: "Añadir" });
    const startDateInput = screen.getByLabelText(/fecha de inicio/i);
    const endDateInput = screen.getByLabelText(/fecha de fin/i);
    const inscriptionEndDateInput = screen.getByLabelText(/cierre de inscripciones/i);
    const submitButton = screen.getByRole("button", { name: "Crear Torneo" });

    fireEvent.change(nameInput, { target: { value: "Torneo de Primavera" } });
    fireEvent.change(descriptionInput, { target: { value: "Descripción del torneo" } });
    fireEvent.change(categoriesInput, { target: { value: "1ª Masculina" } });
    fireEvent.click(addNewCategoryButton);
    fireEvent.change(startDateInput, { target: { value: "2022-01-02T10:00" } });
    fireEvent.change(endDateInput, { target: { value: "2022-01-03T18:00" } });
    fireEvent.change(inscriptionEndDateInput, { target: { value: "2022-01-01T23:59" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createTorneo).toHaveBeenCalled();
    });
  });
});