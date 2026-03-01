import { render, screen } from "@testing-library/react";
import SectionNav from "@/components/common/section-nav";
import * as supabaseModule from "@/lib/supabase/server";
import { useEffect, useState } from "react";

jest.mock("@/lib/supabase/server");

const mockedCreateClient = supabaseModule.createClient;

function AsyncWrapper(props) {
  const [component, setComponent] = useState(null);

  useEffect(() => {
    (async () => {
      const Comp = await SectionNav(props);
      setComponent(Comp);
    })();
  }, [props]);

  return component;
}

describe("SectionNav", () => {
  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/users", label: "Usuarios" },
  ];

  const publicLinks = [
    { href: "/home", label: "Home" },
    { href: "/about", label: "About" },
  ];

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("only shows public link if its not admin", async () => {
    mockedCreateClient.mockResolvedValueOnce({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { app_metadata: { admin: false } } },
        }),
      },
    });

    render(<AsyncWrapper adminLinks={adminLinks} publicLinks={publicLinks} />);

    for (const link of publicLinks) {
      expect(await screen.findByText(link.label)).toBeInTheDocument();
    }

    for (const link of adminLinks) {
      expect(screen.queryByText(link.label)).not.toBeInTheDocument();
    }
  });

  it("shows both links if its admin", async () => {
    mockedCreateClient.mockResolvedValueOnce({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { app_metadata: { admin: true } } },
        }),
      },
    });

    render(<AsyncWrapper adminLinks={adminLinks} publicLinks={publicLinks} />);

    for (const link of publicLinks) {
      expect(await screen.findByText(link.label)).toBeInTheDocument();
    }

    for (const link of adminLinks) {
      expect(screen.queryByText(link.label)).toBeInTheDocument();
    }
  });
});
