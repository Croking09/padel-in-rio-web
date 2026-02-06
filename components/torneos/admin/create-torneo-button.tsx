import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CreateTorneoButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.app_metadata?.admin === true;

  if (!isAdmin) return null;

  return (
    <Button asChild>
      <Link href="/admin/torneos/create-torneo">Crear torneo</Link>
    </Button>
  );
}
