"use client";

import { Button } from "@/components/ui/button";
import { Lock, LockOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleInscriptions } from "@/app/actions/torneos";

interface ToggleInscriptionsButtonProps {
  isAdmin: boolean;
  torneoId: number;
  isClosed: boolean;
  className?: string;
}

export default function ToggleInscriptionsButton({
  isAdmin,
  torneoId,
  isClosed,
  className,
}: ToggleInscriptionsButtonProps) {
  if (!isAdmin) return null;

  return (
    <Button
      className={cn("w-fit hover:cursor-pointer", className)}
      onClick={() => toggleInscriptions(torneoId, !isClosed)}
    >
      {isClosed ? (
        <>
          <LockOpen className="h-4 w-4" />
          Abrir Inscripciones
        </>
      ) : (
        <>
          <Lock className="h-4 w-4" />
          Cerrar Inscripciones
        </>
      )}
    </Button>
  );
}
