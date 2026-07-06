"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteTorneo } from "@/app/actions/torneos";
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

interface DeleteButtonProps {
  torneoId: number;
}

export default function DeleteTorneoButton({ torneoId }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    const error = await deleteTorneo(torneoId);
    setLoading(false);

    if (error) {
      toast.error(error.error, { position: "top-center" });
    } else {
      toast.success("Torneo eliminado correctamente", {
        position: "top-center",
      });
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
