import Socials from "./socials";
import { Logo } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="bg-primary p-8 shadow-top grid gap-8 items-center text-center md:grid-cols-3 md:grid-rows-1">
      <Logo className="w-30 h-30 mx-auto md:justify-self-start md:ml-6" />

      <hr className="w-full border-border md:hidden" />

      <Socials className="mx-auto md:justify-self-center" />

      <div className="hidden md:block" />
    </footer>
  );
}
