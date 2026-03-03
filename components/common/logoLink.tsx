"use client";

import Link from "next/link";
import { Logo } from "@/components/icons";
import { useWebHaptics } from "web-haptics/react";

export default function LogoLink() {
  const { trigger } = useWebHaptics();

  return (
    <Link
      href="/"
      onClick={() =>
        trigger([{ duration: 30 }, { delay: 60, duration: 40, intensity: 1 }])
      }
    >
      <Logo className="w-15 h-15 hover:text-secondary hover:scale-110 transition-all duration-300" />
    </Link>
  );
}
