import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function LigaNav() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.app_metadata?.admin === true;

  return (
    <nav className="p-2 bg-primary/80">
      <ul className="flex gap-2 overflow-x-scroll md:overflow-x-auto [&>li]:hover:bg-background/40 [&>li]:rounded-md [&>li]:px-2 [&>li]:py-1">
        {isAdmin && (
          <li>
            <Link href="/admin/liga/asignacion">Asignación</Link>
          </li>
        )}
        {isAdmin && (
          <li>
            <Link href="/admin/liga/generador">Generador</Link>
          </li>
        )}
        <li>
          <Link href="/liga/partidos">Partidos</Link>
        </li>
        <li>
          <Link href="/liga/reglamento">Reglamento</Link>
        </li>
      </ul>
    </nav>
  );
}
