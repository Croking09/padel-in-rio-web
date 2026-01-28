import "@testing-library/jest-dom";
import ReactDOMServer from "react-dom/server";
import Torneos from "@/components/torneos/torneos";

jest.mock("@/app/actions/torneos", () => ({
  getTorneos: jest.fn(),
}));

import { getTorneos } from "@/app/actions/torneos";

describe("Torneos", () => {
  test("each torneo should display correct data", async () => {
    getTorneos.mockResolvedValue({
      data: [
        {
          name: "Primavera 2024",
          description:
            "El fin de semana del 10 al 12 de mayo, categorías masculinas y femeninas únicas. 15€ por inscripción.",
          start_date: "2024-05-10T00:00:00",
          imageUrl: null,
        },
      ],
      totalPages: 1,
    });

    const props = {
      page: 1,
    };

    const html = ReactDOMServer.renderToString(await Torneos(props));
    expect(html).toContain("Primavera 2024");
    expect(html).toContain("15€ por inscripción");
    expect(html).toContain("10/05/2024");
  });

  test("renders fallback image when imageUrl is null", async () => {
    getTorneos.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Torneo Fallback",
          description: "Descripción",
          start_date: "2024-05-10T00:00:00",
          imageUrl: null, // fallback
        },
      ],
      totalPages: 1,
    });

    const html = ReactDOMServer.renderToString(await Torneos({ page: 1 }));

    expect(html).toContain('src="/torneos/fallback.png"');
  });
});
