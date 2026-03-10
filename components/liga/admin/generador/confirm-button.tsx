"use client";

import { confirmMonth } from "@/app/actions/generador-partidos";
import { Button } from "@/components/ui/button";
import { Match } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useWebHaptics } from "web-haptics/react";

export default function ConfirmButton({
  className,
  matches,
  monthId,
}: {
  className?: string;
  matches: Match[];
  monthId: number;
}) {
  const { trigger } = useWebHaptics();

  const onConfirm = async () => {
    const response = await confirmMonth(monthId, matches);

    if (!response.success) {
      toast.error(response.error?.message, { position: "top-center" });
      return;
    } else {
      toast.success("Mes confirmado correctamente", {
        position: "top-center",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className={className}
          variant="secondary"
          onClick={() =>
            trigger([
              { duration: 30 },
              { delay: 60, duration: 40, intensity: 1 },
            ])
          }
        >
          Confirmar
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción confirmará los partidos de manera permanente. No se
            puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} variant="secondary">
            Sí, confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
