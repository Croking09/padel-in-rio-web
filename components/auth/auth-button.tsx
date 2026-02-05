import Link from "next/link";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { headers } from "next/headers";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";

  return user ? (
    <div className="flex items-center gap-4">
      Hola! {user.email}
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href={`/auth/login?redirectTo=${encodeURIComponent(pathname)}`}>
          Inicia Sesión
        </Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Regístrate</Link>
      </Button>
    </div>
  );
}
