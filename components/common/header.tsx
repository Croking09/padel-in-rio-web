import NavBar from "./navBar";
import { Logo } from "@/components/icons";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-primary flex flex-row p-5 shadow-bottom justify-between items-center">
      <Link href="/">
        <Logo className="w-15 h-15 hover:text-secondary hover:scale-110 transition-all duration-300" />
      </Link>
      <NavBar />
    </header>
  );
}
