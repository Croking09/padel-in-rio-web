import { render, screen } from "@testing-library/react";
import LigaNav from "@/components/liga/liga-nav";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }) => <a href={href}>{children}</a>,
}));
const mockGetUser = jest.fn();

jest.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: {
      getUser: mockGetUser,
    },
  }),
}));

describe("LigaNav", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("muestra solo Reglamento si el usuario NO es admin", async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          app_metadata: {},
        },
      },
    });

    const Component = await LigaNav();
    render(Component);

    expect(screen.getByText("Reglamento")).toBeInTheDocument();

    expect(screen.queryByText("Asignación")).not.toBeInTheDocument();
    expect(screen.queryByText("Generador")).not.toBeInTheDocument();
  });

  it("muestra links de admin si el usuario ES admin", async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          app_metadata: {
            admin: true,
          },
        },
      },
    });

    const Component = await LigaNav();
    render(Component);

    expect(screen.getByText("Asignación")).toBeInTheDocument();
    expect(screen.getByText("Generador")).toBeInTheDocument();
    expect(screen.getByText("Reglamento")).toBeInTheDocument();
  });

  it("tiene las rutas correctas", async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          app_metadata: {
            admin: true,
          },
        },
      },
    });

    const Component = await LigaNav();
    render(Component);

    expect(screen.getByText("Asignación").closest("a")).toHaveAttribute(
      "href",
      "/admin/liga/asignacion",
    );

    expect(screen.getByText("Generador").closest("a")).toHaveAttribute(
      "href",
      "/admin/liga/generador",
    );

    expect(screen.getByText("Reglamento").closest("a")).toHaveAttribute(
      "href",
      "/liga/reglamento",
    );
  });
});
