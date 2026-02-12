import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CirclePlus } from "lucide-react";

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
      <Link href="/admin/torneos/create-torneo">
        <CirclePlus className="h-4 w-4" />
        Crear torneo
      </Link>
    </Button>
  );
}
