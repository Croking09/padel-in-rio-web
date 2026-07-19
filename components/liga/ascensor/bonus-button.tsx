"use client";

import { giveMonthlyBonus } from "@/app/actions/classification-actions";
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
import { Button } from "@/components/ui/button";
import { CategoryClassification } from "@/lib/types/classification";
import { toast } from "sonner";

export default function CreateSocioButton({
  classification,
  month_id,
}: {
  classification: CategoryClassification[];
  month_id: number;
}) {
  const onConfirm = async () => {
    const result = await giveMonthlyBonus(classification, month_id);

    if (result.success) {
      toast.success("Bonus aplicado correctamente");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button>Dar bonus</Button>}
      ></AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción concederá el bonus según la clasificación actual. No se
            puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Sí, dar bonus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
