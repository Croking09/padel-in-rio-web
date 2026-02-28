import { render, screen } from "@testing-library/react";
import InstallTutorialCarousel from "@/components/common/installTutorialCarousel";

global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

global.ResizeObserver = class ResizeObserver {
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

describe("InstallTutorialCarousel Component", () => {
  test("debe renderizar correctamente el primer paso (título y descripción)", () => {
    render(<InstallTutorialCarousel />);
    
    const title = screen.getByText(/1 Pulsa los tres puntos/i);
    expect(title).toBeInTheDocument();
    
    const description = screen.getByText(/En la esquina inferior derecha del navegador/i);
    expect(description).toBeInTheDocument();
  });

  test("todas las imágenes deben tener el atributo alt correspondiente al título", () => {
    render(<InstallTutorialCarousel />);
    
    const images = screen.getAllByRole("img");
    expect(images[0]).toHaveAttribute("alt", "1 Pulsa los tres puntos");
  });

  test("los botones de navegación deben estar presentes", () => {
    render(<InstallTutorialCarousel />);
    
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(2);
  });

  test("debe renderizar el último paso correctamente", () => {
    render(<InstallTutorialCarousel />);
    
    const lastStepTitle = screen.getByText(/4 Pulsa “Añadir” para confirmar/i);
    const lastStepDesc = screen.getByText(/Puedes cambiar el nombre antes de añadirla si quieres/i);
    
    expect(lastStepTitle).toBeInTheDocument();
    expect(lastStepDesc).toBeInTheDocument();
  });
});