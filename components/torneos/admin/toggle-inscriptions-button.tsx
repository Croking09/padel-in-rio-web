"use client";

import { Button } from "@/components/ui/button";
import { Lock, LockOpen } from "lucide-react";
import { toggleInscriptions } from "@/app/actions/inscripciones";
import { toast } from "sonner";

interface ToggleInscriptionsButtonProps {
  torneoId: number;
  isClosed: boolean;
}

export default function ToggleInscriptionsButton({
  torneoId,
  isClosed,
}: ToggleInscriptionsButtonProps) {
  return (
    <Button
      variant="secondary"
      onClick={async () => {
        const error = await toggleInscriptions(torneoId, !isClosed);

        if (error) {
          toast.error(error.error);
        } else {
          const text = isClosed ? "abiertas" : "cerradas";
          toast.success("Inscripciones " + text + " correctamente");
        }
      }}
    >
      {isClosed ? (
        <>
          <LockOpen className="h-4 w-4" />
          Abrir inscripciones
        </>
      ) : (
        <>
          <Lock className="h-4 w-4" />
          Cerrar inscripciones
        </>
      )}
    </Button>
  );
}
