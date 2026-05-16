import "@testing-library/jest-dom";
import ReactDOMServer from "react-dom/server";
import Torneos from "@/components/torneos/torneos";

jest.mock("@/app/actions/torneos", () => ({
  getTorneos: jest.fn(),
}));

jest.mock("@/app/actions/inscripciones", () => ({
  getMyInscripcionesOpenTorneos: jest.fn(),
}));

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn().mockResolvedValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    },
  }),
}));

jest.mock("@/components/torneos/admin/view-inscriptions-button", () => ({
  __esModule: true,
  default: () => `<button>Ver inscripciones</button>`,
}));

jest.mock("@/components/torneos/admin/toggle-inscriptions-button", () => ({
  __esModule: true,
  default: ({ isClosed }) =>
    isClosed
      ? `<button>Abrir Inscripciones</button>`
      : `<button>Cerrar Inscripciones</button>`,
}));

jest.mock("@/components/torneos/admin/delete-button", () => ({
  __esModule: true,
  default: () => `<button>Eliminar torneo</button>`,
}));

jest.mock("@/components/torneos/admin/create-torneo-button", () => ({
  __esModule: true,
  default: () => `<button>Crear torneo</button>`,
}));

import { getTorneos } from "@/app/actions/torneos";
import { getMyInscripcionesOpenTorneos } from "@/app/actions/inscripciones";
import { createClient } from "@/lib/supabase/server";

describe("Torneos", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-05-09T12:00:00"));
  });

  beforeEach(() => {
    getMyInscripcionesOpenTorneos.mockResolvedValue({ data: [] });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("each torneo should display correct data", async () => {
    getTorneos.mockResolvedValue({
      data: [
        {
          id: 1,
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

  test("inscription button is disabled when inscription_end_date is before today", async () => {
    getTorneos.mockResolvedValue({
      data: [
        {
          id: 1,
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

  test("close inscriptions button is available if user is admin", async () => {
    createClient.mockResolvedValueOnce({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: {
            user: {
              app_metadata: {
                admin: true,
              },
            },
          },
        }),
      },
    });

    getTorneos.mockResolvedValue({
      data: [
        {
          id: 1,
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
    expect(html).toContain("Cerrar Inscripciones");
  });

  test("open inscriptions button is available if user is admin and tournament is closed", async () => {
    createClient.mockResolvedValueOnce({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: {
            user: {
              app_metadata: {
                admin: true,
              },
            },
          },
        }),
      },
    });

    getTorneos.mockResolvedValue({
      data: [
        {
          id: 1,
          name: "Primavera 2024",
          description: "Desc",
          start_date: "2024-05-10T00:00:00",
          imageUrl: null,
          end_date: "2024-05-12T00:00:00",
          inscription_end_date: "2024-05-09T00:00:00",
          manually_closed: true,
        },
      ],
      totalPages: 1,
    });

    const html = ReactDOMServer.renderToString(await Torneos({ page: 1 }));
    expect(html).toContain("Abrir Inscripciones");
  });

  test("delete button is available if user is admin", async () => {
    createClient.mockResolvedValueOnce({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: {
            user: {
              app_metadata: {
                admin: true,
              },
            },
          },
        }),
      },
    });

    getTorneos.mockResolvedValue({
      data: [
        {
          id: 1,
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
    expect(html).toContain("Eliminar torneo");
  });

  test("view inscriptions button is available if user is admin", async () => {
    createClient.mockResolvedValueOnce({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: {
            user: {
              app_metadata: {
                admin: true,
              },
            },
          },
        }),
      },
    });

    getTorneos.mockResolvedValue({
      data: [
        {
          id: 1,
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
    expect(html).toContain("Ver inscripciones");
  });
});
