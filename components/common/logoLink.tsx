import Link from "next/link";
import { Logo } from "@/components/icons";

export default function LogoLink() {
  return (
    <Link href="/">
      <Logo className="w-15 h-15 hover:text-secondary hover:scale-110 transition-all duration-300" />
    </Link>
  );
}
