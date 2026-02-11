import "@testing-library/jest-dom";
import ReactDOMServer from "react-dom/server";
import Socios from "@/components/asociacion/socios";

jest.mock("@/app/actions/socios", () => ({
  getAllSocios: jest.fn(),
}));

import { getAllSocios } from "@/app/actions/socios";

describe("Socios", () => {
  test("list should contain all socios", async () => {
    getAllSocios.mockResolvedValue([
      { id: 1, full_name: "Juanito" },
      { id: 2, full_name: "Pedrito" },
    ]);

    const html = ReactDOMServer.renderToString(await Socios());
    expect(html).toContain("Juanito");
    expect(html).toContain("Pedrito");
  });
});
