"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { deleteTorneo } from "@/app/actions/torneos";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  torneoId: number;
  className?: string;
}

export default function DeleteButton({
  torneoId,
  className,
}: DeleteButtonProps) {
  return (
    <Button
      className={cn("w-fit hover:cursor-pointer", className)}
      variant="destructive"
      onClick={() => deleteTorneo(torneoId)}
    >
      <Trash2 className="h-4 w-4" />
      Eliminar torneo
    </Button>
  );
}
