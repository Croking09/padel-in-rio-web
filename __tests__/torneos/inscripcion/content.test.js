import "@testing-library/jest-dom";
import ReactDOMServer from "react-dom/server";
import InscripcionContent from "@/components/torneos/inscripcion/inscripcion-content";

jest.mock("@/app/actions/torneos", () => ({
  getTorneoById: jest.fn(),
}));

import { getTorneoById } from "@/app/actions/torneos";

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

import { createClient } from "@/lib/supabase/server";

jest.mock("@/components/auth/auth-button", () => ({
  AuthButton: () => <div>Auth Button</div>,
}));

jest.mock("@/components/torneos/inscripcion/form", () => {
  return function MockForm() {
    return <div>Formulario Inscripcion</div>;
  };
});

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("Inscripcion Content", () => {
  test("all data should be displayed", async () => {
    // mock torneo y client
    getTorneoById.mockImplementation(() => ({
      id: "1",
      name: "Primavera 2024",
      description: "El fin de semana del 10 al 12 de mayo...",
      start_date: "2028-05-10T00:00:00",
      categories: ["A", "B"],
    }));

    createClient.mockImplementation(() => ({
      auth: {
        getClaims: jest.fn().mockImplementation(() => ({
          data: { claims: null },
        })),
      },
    }));

    const props = {
      searchParams: Promise.resolve({
        id: "1",
      }),
    };

    const html = ReactDOMServer.renderToString(await InscripcionContent(props));

    expect(html).toContain("Primavera 2024");
    expect(html).toContain("Inscripción para"); // titulo
    expect(html).toContain("Necesitas iniciar sesión"); // mensaje para usuario anon
    expect(html).toContain("Formulario Inscripcion");
  });
});
