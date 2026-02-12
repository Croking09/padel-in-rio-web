import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Eye } from "lucide-react";

interface ViewInscriptionsButton {
  torneoId: number;
  className?: string;
}

export default function ViewInscriptionsButton({
  torneoId,
  className,
}: ViewInscriptionsButton) {
  return (
    <Button
      className={cn("w-fit hover:cursor-pointer", className)}
      variant="secondary"
      asChild
    >
      <Link href={`/admin/torneos/${torneoId}/inscripciones`}>
        <Eye className="h-4 w-4" />
        Ver inscripciones
      </Link>
    </Button>
  );
}
