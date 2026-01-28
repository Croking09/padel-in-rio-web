import IconCardFromBD from "@/components/home/iconCardFromBD";
import { Person } from "@/components/icons";
import "@testing-library/jest-dom";
import ReactDOMServer from "react-dom/server";

jest.mock("@/app/actions/socios", () => ({
  getSociosCount: jest.fn(),
}));

jest.mock("@/app/actions/ligas", () => ({
  getLigasCount: jest.fn(),
}));

jest.mock("@/app/actions/torneos", () => ({
  getTorneosCount: jest.fn(),
}));

import { getSociosCount } from "@/app/actions/socios";

describe("IconCardFromBD", () => {
  test("icon cards should display correct data", async () => {
    getSociosCount.mockResolvedValue(1);

    const props = {
      type: "socios",
      icon: <Person />
    };

    const html = ReactDOMServer.renderToString(await IconCardFromBD(props));
    expect(html).toContain("1");
    expect(html).toContain("SOCIOS");
  });
});
