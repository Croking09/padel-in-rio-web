import "@testing-library/jest-dom";
import Page from "@/app/page";
import { render, screen } from '@testing-library/react';

jest.mock('@/components/home/carousel', () => {
  return function Carousel() {
    return <div data-testid="carousel-mock">Carousel</div>;
  };
});

jest.mock('@/components/home/iconCardFromBD', () => {
  return function IconCardFromBD({ type, icon }) {
    return (
      <div data-testid={`icon-card-${type}`}>
        {icon}
        <span>1</span>
        <span>{type.toUpperCase()}</span>
      </div>
    );
  };
});

jest.mock('@/components/home/map', () => {
  return function Map() {
    return <div data-testid="map-mock">Map</div>;
  };
});

describe("Home", () => {
  test("there should be 4 icon cards", async () => {
    const PageComponent = await Page();
    const { container } = render(PageComponent);
    
    const cards = container.querySelectorAll('[data-testid^="icon-card-"]');
    expect(cards).toHaveLength(3); // socios, torneos, ligas
    
    expect(screen.getByText("CLASES")).toBeInTheDocument();
    expect(screen.getByText(">1000")).toBeInTheDocument();
    
    expect(screen.getByText("SOCIOS")).toBeInTheDocument();
    expect(screen.getByText("TORNEOS")).toBeInTheDocument();
    expect(screen.getByText("LIGAS")).toBeInTheDocument();
  });

  test("map section should have a title and button", async () => {
    const PageComponent = await Page();
    render(PageComponent);
    
    expect(screen.getByText("NUESTRA CASA")).toBeInTheDocument();
    expect(screen.getByText(/RESERVA/i)).toBeInTheDocument();
  });
});
