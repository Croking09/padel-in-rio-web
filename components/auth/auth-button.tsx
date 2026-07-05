import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { LogIn } from "lucide-react";
import { AvatarMenu } from "./avatar-menu";
import { buttonVariants } from "@/components/ui/button";

export async function AuthButton({ compact = false }: { compact?: boolean }) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";

  return user ? (
    <AvatarMenu email={user.email} />
  ) : (
    <div className="flex gap-2">
      <Link
        href={`/auth/login?redirectTo=${encodeURIComponent(pathname)}`}
        className={buttonVariants({ variant: "outline", size: "default" })}
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
