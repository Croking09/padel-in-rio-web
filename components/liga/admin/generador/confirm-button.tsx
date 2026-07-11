"use client";

import { confirmMonth } from "@/app/actions/generador-partidos";
import { Button } from "@/components/ui/button";
import { Match } from "@/lib/types/match";
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

export default function ConfirmButton({
  matches,
  monthId,
}: {
  matches: Match[];
  monthId: number;
}) {
  const onConfirm = async () => {
    const response = await confirmMonth(monthId, matches);

    if (!response.success) {
      toast.error(response.error?.message);
      return;
    } else {
      toast.success("Partidos confirmados correctamente");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button>Confirmar</Button>}
      ></AlertDialogTrigger>

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
          <AlertDialogAction onClick={onConfirm}>
            Sí, confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
