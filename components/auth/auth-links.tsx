"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function AuthLinks({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-2">
      <Link
        href={`/auth/login?redirectTo=${encodeURIComponent(pathname)}`}
        className={buttonVariants({ variant: "muted", size: "default" })}
      >
        {compact && <LogIn data-icon="inline-start" />}
        Inicia Sesión
      </Link>

      {!compact && (
        <Link
          href="/auth/sign-up"
          className={buttonVariants({ variant: "default", size: "default" })}
        >
          Regístrate
        </Link>
      )}
    </div>
  );
}
