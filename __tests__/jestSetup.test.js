import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "@/app/page";

describe("Jest Setup", () => {
  test("1 + 1 should equal 2", () => {
    expect(1 + 1).toBe(2);
  });

  test("Supabase should be in the document at least once", () => {
    render(<Page />);

    const supabaseText = screen.getAllByText(/Supabase/i);
    expect(supabaseText[0]).toBeInTheDocument();
  });
});
