import "@testing-library/jest-dom";
import ReactDOMServer from "react-dom/server";
import Torneos from "@/components/torneos/torneos";

jest.mock("@/app/actions/torneos", () => ({
  getTorneos: jest.fn(),
}));

import { getTorneos } from "@/app/actions/torneos";

describe("Torneos", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-05-09T12:00:00"));
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  test("each torneo should display correct data", async () => {
    getTorneos.mockResolvedValue({
      data: [
        {
          name: "Primavera 2024",
          description:
            "El fin de semana del 10 al 12 de mayo, categorías masculinas y femeninas únicas. 15€ por inscripción.",
          start_date: "2024-05-11T00:00:00",
          imageUrl: null,
          end_date: "2024-05-13T00:00:00",
          inscription_end_date: "2024-05-12T00:00:00",
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
    expect(html).toContain("11/05/2024");
    expect(html).toContain("13/05/2024");
    expect(html).toContain("INSCRIBIRSE");
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

  test("button is disabled when inscription_end_date is before today", async () => {
    getTorneos.mockResolvedValue({
      data: [
        {
          name: "Primavera 2024",
          description:
            "El fin de semana del 10 al 12 de mayo, categorías masculinas y femeninas únicas. 15€ por inscripción.",
          start_date: "2024-05-10T00:00:00",
          imageUrl: null,
          end_date: "2024-05-12T00:00:00",
          inscription_end_date: "2024-05-09T00:00:00",
        },
      ],
      totalPages: 1,
    });

    const props = {
      page: 1,
    };

    const html = ReactDOMServer.renderToString(await Torneos(props));
    expect(html).toContain("INSCRIPCIONES CERRADAS");
  });
});
