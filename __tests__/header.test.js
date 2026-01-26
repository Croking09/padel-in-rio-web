import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react"
import Header from "@/components/common/header"

describe("Header", () => {
  test("there should be 4 navigation links", () => {
    render(<Header />);

    const links = screen.getAllByRole('link');

    expect(links.length).toBe(4);
  });
})