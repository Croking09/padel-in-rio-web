import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminNav() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.app_metadata?.admin === true;

  if (!isAdmin) return null;

  return (
    <nav className="p-2">
      <ul className="flex gap-4">
        <li>
          <Link href="/admin/liga/asignacion" className="hover:underline">
            Asignación
          </Link>
        </li>
        <li>
          <Link href="/admin/liga/generador" className="hover:underline">
            Generador de partidos
          </Link>
        </li>
      </ul>
    </nav>
  );
}
