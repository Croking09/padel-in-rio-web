"use client";

import { Button } from "@/components/ui/button";
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
import { confirmMonth } from "@/app/actions/match-generator-actions";
import { GeneratedMatch } from "@/lib/types/match";

export default function ConfirmButton({
  matches,
  monthId,
}: {
  matches: GeneratedMatch[];
  monthId: number;
}) {
  const onConfirm = async () => {
    const response = await confirmMonth(monthId, matches);

    if (!response.success) {
      toast.error(response.error);
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
