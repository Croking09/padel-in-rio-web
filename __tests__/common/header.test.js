import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Header from "@/components/common/header";

describe("Header", () => {
  test("there should be 5 navigation links with correct hrefs", () => {
    render(<Header />);

    const links = screen.getAllByRole("link");

    expect(links).toHaveLength(5);

    const expectedHrefs = [
      "/",
      "/torneos",
      "/liga/reglamento",
      "/asociacion",
      "#",
    ];

    links.forEach((link, index) => {
      expect(link).toHaveAttribute("href", expectedHrefs[index]);
    });
  });
});
