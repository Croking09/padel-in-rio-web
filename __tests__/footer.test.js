import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react"
import Footer from "@/components/common/footer"

describe("Footer", () => {
  test("all socials must appear", () => {
    render(<Footer />);

    expect(screen.getByText(/padelinrio@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/@padel.in.rio/i)).toBeInTheDocument();
    expect(screen.getByText(/666 66 66 66/i)).toBeInTheDocument();
  });
})