import { render, screen, fireEvent } from "@testing-library/react";
import SociosClient from "@/components/asociacion/admin/socios-client";
import * as sociosActions from "@/app/actions/socios";

jest.mock("@/app/actions/socios", () => ({
  getSocios: jest.fn(),
}));

describe("SociosClient", () => {
  const mockSocios = [
    { id: "1", full_name: "Juan Pérez", nickname: "jp", active: true },
    { id: "2", full_name: "Ana Gómez", nickname: "ana", active: false },
  ];

  beforeEach(() => {
    sociosActions.getSocios.mockResolvedValue(mockSocios);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("muestra los socios mockeados", async () => {
    const socios = await sociosActions.getSocios();
    render(<SociosClient socios={socios} />);

    expect(await screen.findByText("Juan Pérez")).toBeInTheDocument();
    expect(await screen.findByText("Ana Gómez")).toBeInTheDocument();
  });

  it("filtra por nombre o nickname", async () => {
    const socios = await sociosActions.getSocios();
    render(<SociosClient socios={socios} />);

    fireEvent.change(screen.getByPlaceholderText("Buscar socio..."), {
      target: { value: "jp" },
    });

    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
    expect(screen.queryByText("Ana Gómez")).not.toBeInTheDocument();
  });

  it("muestra mensaje si no hay resultados", async () => {
    const socios = await sociosActions.getSocios();
    render(<SociosClient socios={socios} />);

    fireEvent.change(screen.getByPlaceholderText("Buscar socio..."), {
      target: { value: "xyz" },
    });

    expect(
      await screen.findByText("No se encontraron socios"),
    ).toBeInTheDocument();
  });
});
