import Link from "next/link";

export default function NavBar({ className }: { className?: string }) {
  return (
    <nav className={`hidden lg:block ${className}`}>
      <ul className="flex gap-8 font-bold text-xl items-center [&_a]:inline-block [&_a]:transition-all [&_a]:duration-300 [&_a]:hover:-translate-y-1 [&_a]:hover:text-primary">
        <li>
          <Link href="/torneos">TORNEOS</Link>
        </li>
        <li>
          <Link href="/liga/ascensor">LIGA</Link>
        </li>
        <li>
          <Link href="/asociacion">ASOCIACION</Link>
        </li>
        <li>
          <Link href="/equipo">EQUIPO</Link>
        </li>
      </ul>
    </nav>
  );
}
