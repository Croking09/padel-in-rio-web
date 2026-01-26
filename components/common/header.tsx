export default function Header() {
  return (
    <header className="bg-primary flex flex-row p-5 shadow-[0_10px_10px_rgba(0,0,0,0.25)]">
      <nav>
        <ul className="flex flex-row gap-8 font-bold text-2xl">
          <li>
            <a href="#" className="hover:text-secondary transition-colors">
              TORNEOS
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-secondary transition-colors">
              LIGA
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-secondary transition-colors">
              ASOCIACION
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-secondary transition-colors">
              EQUIPO
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
