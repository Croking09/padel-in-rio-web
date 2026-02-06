import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CreateTorneoButtonProps {
  className?: string;
}

export default async function CreateTorneoButton({
  className,
}: CreateTorneoButtonProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.app_metadata?.admin === true;

  if (!isAdmin) return null;

  return (
    <Button asChild className={className}>
      <Link href="/admin/torneos/create-torneo">Crear torneo</Link>
    </Button>
  );
}
