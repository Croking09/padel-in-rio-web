import Socials from "./socials";
import { Logo } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary p-8 grid gap-8 items-center text-center md:grid-cols-3 md:grid-rows-1">
      <Logo className="w-auto h-32 mx-auto md:justify-self-start md:ml-16" />

      <Separator className="md:hidden" />

      <Socials className="mx-auto md:justify-self-center" />

      <Separator className="md:hidden" />

      <div className="text-muted-foreground text-sm self-end">
        <Link href="/politica-de-cookies" className="hover:underline">
          Política de Cookies
        </Link>
      </div>
    </footer>
  );
}
