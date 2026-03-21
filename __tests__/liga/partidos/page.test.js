jest.mock("next/cache", () => ({
  unstable_cache: (fn) => fn,
  revalidateTag: jest.fn(),
  revalidatePath: jest.fn(),
}));

import { render, screen } from "@testing-library/react";
import Page from "@/app/liga/partidos/page";
import { getMonths } from "@/app/actions/monthly-assignment";
import { getConfirmedMatches } from "@/app/actions/partidos";
import { createClient } from "@/lib/supabase/server";

jest.mock("@/app/actions/monthly-assignment");
jest.mock("@/app/actions/partidos");
jest.mock("@/components/liga/admin/asignaciones/month-selector", () => {
  return function MockMonthSelector() {
    return <div data-testid="month-selector" />;
  };
});

jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn().mockResolvedValue({
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { app_metadata: { admin: false } } },
      }),
    },
  }),
}));

const mockGetMonths = getMonths;
const mockGetConfirmedMatches = getConfirmedMatches;

describe("Liga partidos page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows a message if there are no confirmed months", async () => {
    mockGetMonths.mockResolvedValue([]);

    const jsx = await Page({ searchParams: Promise.resolve({}) });

    render(jsx);

    expect(
      screen.getByText("Todavía no hay partidos confirmados."),
    ).toBeInTheDocument();
  });

  it("renders month selector if there are confirmed months", async () => {
    mockGetMonths.mockResolvedValue([
      { id: 1, month: 1, year: 2026, status: "confirmed" },
    ]);

    mockGetConfirmedMatches.mockResolvedValue([]);

    const jsx = await Page({ searchParams: Promise.resolve({}) });

    render(jsx);

    expect(screen.getByTestId("month-selector")).toBeInTheDocument();
  });

  it("calculates global matchdays", async () => {
    mockGetMonths.mockResolvedValue([
      { id: 1, month: 1, year: 2026, status: "confirmed" },
      { id: 2, month: 2, year: 2026, status: "confirmed" },
    ]);

    mockGetConfirmedMatches.mockResolvedValue([
      {
        matchday: 1,
        categoryName: "Primera",
        players: [
          { id: "1", full_name: "A" },
          { id: "2", full_name: "B" },
        ],
      },
      {
        matchday: 2,
        categoryName: "Primera",
        players: [
          { id: "3", full_name: "C" },
          { id: "4", full_name: "D" },
        ],
      },
    ]);

    const jsx = await Page({
      searchParams: Promise.resolve({ monthId: "2" }),
    });

    render(jsx);

    // Febrero = index 1 → offset 2
    expect(screen.getByText("Jornada 3")).toBeInTheDocument();
    expect(screen.getByText("Jornada 4")).toBeInTheDocument();
  });

  it("groups matches by category", async () => {
    mockGetMonths.mockResolvedValue([
      { id: 1, month: 1, year: 2026, status: "confirmed" },
    ]);

    mockGetConfirmedMatches.mockResolvedValue([
      {
        matchday: 1,
        categoryName: "Primera",
        players: [{ id: "1", full_name: "A" }],
      },
      {
        matchday: 1,
        categoryName: "Segunda",
        players: [{ id: "2", full_name: "B" }],
      },
    ]);

    const jsx = await Page({ searchParams: Promise.resolve({}) });

    render(jsx);

    expect(screen.getByText("Primera")).toBeInTheDocument();
    expect(screen.getByText("Segunda")).toBeInTheDocument();
  });

  it("shows a message if no matches are found for the selected month", async () => {
    mockGetMonths.mockResolvedValue([
      { id: 1, month: 1, year: 2026, status: "confirmed" },
    ]);

    mockGetConfirmedMatches.mockResolvedValue([]);

    const jsx = await Page({
      searchParams: Promise.resolve({ monthId: "1" }),
    });

    render(jsx);

    expect(
      screen.getByText("No se encontraron partidos para el mes seleccionado."),
    ).toBeInTheDocument();
  });

  it("shows admin button if user is admin", async () => {
    createClient.mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { app_metadata: { admin: true } } },
        }),
      },
    });

    mockGetMonths.mockResolvedValue([
        { id: 1, month: 1, year: 2026, status: "confirmed" },
      ]);

    mockGetConfirmedMatches.mockResolvedValue([
      {
        matchday: 1,
        categoryName: "Primera",
        players: [{ id: "1", full_name: "A" }],
      },
    ]);

    const jsx = await Page({ searchParams: Promise.resolve({}) });

    render(jsx);

    expect(screen.getByText("Introducir resultados")).toBeInTheDocument();
  });
});
