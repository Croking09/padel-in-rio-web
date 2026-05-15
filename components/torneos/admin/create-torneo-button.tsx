import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

interface CreateTorneoButtonProps {
  className?: string;
}

export default async function CreateTorneoButton({
  className,
}: CreateTorneoButtonProps) {
  return (
    <Button asChild className={className}>
      <Link href="/admin/torneos/create-torneo">
        <PlusIcon className="h-4 w-4" />
        Crear torneo
      </Link>
    </Button>
  );
}
