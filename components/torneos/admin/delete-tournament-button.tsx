"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
import { deleteTournament } from "@/app/actions/tournament-actions";

interface DeleteButtonProps {
  tournamentId: number;
}

export default function DeleteTournamentButton({
  tournamentId,
}: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    const result = await deleteTournament(tournamentId);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Torneo eliminado correctamente");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive">
            <Trash2 className="h-4 w-4" />
            Eliminar torneo
          </Button>
        }
      ></AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará el torneo de manera permanente. No se puede
            deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            variant="destructive"
          >
            {loading ? "Eliminando..." : "Sí, eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
