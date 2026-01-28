import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import PaginationControls from "@/components/torneos/pagination-controls";

jest.mock("next/link", () => {
  const MockLink = ({ children, href }) => <a href={href}>{children}</a>;
  MockLink.displayName = "NextLink";
  return MockLink;
});

describe("Pagination Controls", () => {
  test("back button is disabled when on first page", () => {
    render(<PaginationControls currentPage={1} totalPages={3} />);

    expect(screen.getByText("1 de 3")).toBeInTheDocument();

    const prevButton = screen.getByRole("button", { name: /Anterior/i });
    expect(prevButton).toBeDisabled();

    const nextButton = screen.getByRole("link", { name: /Siguiente/i });
    expect(nextButton).toBeEnabled();

    const nextLink = screen.getByRole("link", { name: /Siguiente/i });
    expect(nextLink).toHaveAttribute("href", "/torneos?page=2");
  });

  test("both buttons are active", () => {
    render(<PaginationControls currentPage={2} totalPages={3} />);

    expect(screen.getByText("2 de 3")).toBeInTheDocument();

    const prevButton = screen.getByRole("link", { name: /Anterior/i });
    expect(prevButton).toBeEnabled();

    const prevLink = screen.getByRole("link", { name: /Anterior/i });
    expect(prevLink).toHaveAttribute("href", "/torneos?page=1");

    const nextButton = screen.getByRole("link", { name: /Siguiente/i });
    expect(nextButton).toBeEnabled();

    const nextLink = screen.getByRole("link", { name: /Siguiente/i });
    expect(nextLink).toHaveAttribute("href", "/torneos?page=3");
  });

  test("next button is disabled when on last page", () => {
    render(<PaginationControls currentPage={3} totalPages={3} />);

    expect(screen.getByText("3 de 3")).toBeInTheDocument();

    const prevButton = screen.getByRole("link", { name: /Anterior/i });
    expect(prevButton).toBeEnabled();

    const prevLink = screen.getByRole("link", { name: /Anterior/i });
    expect(prevLink).toHaveAttribute("href", "/torneos?page=2");

    const nextButton = screen.getByRole("button", { name: /Siguiente/i });
    expect(nextButton).toBeDisabled();
  });
});
