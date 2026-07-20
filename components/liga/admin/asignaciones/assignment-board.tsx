"use client";

import { useState, useEffect, useMemo } from "react";
import { DndProvider } from "react-dnd";
import {
  TouchTransition,
  MouseTransition,
  MultiBackend,
} from "react-dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
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
import { Checkbox } from "@/components/ui/checkbox";
import UnassignedColumn from "./unassigned-column";
import CategoryColumn from "./category-column";
import { DragItem } from "./types";
import { AssignmentData } from "@/lib/types/player-assignment";
import {
  confirmMonth,
  saveAssignments,
} from "@/app/actions/player-assignment-actions";
import { updateUseFithCategory } from "@/app/actions/month-actions";

interface AssignmentBoardProps {
  initialData: AssignmentData;
  monthId: number;
}

const HTML5toTouch = {
  backends: [
    {
      id: "html5",
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      id: "touch",
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

export default function AssignmentBoard({
  initialData,
  monthId,
}: AssignmentBoardProps) {
  const [data, setData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [useFifthCategory, setUseFifthCategory] = useState(
    initialData.useFifthCategory,
  );

  useEffect(() => {
    setData(initialData);
    setHasChanges(false);
    setUseFifthCategory(initialData.useFifthCategory);
  }, [initialData]);

  const handleToggleFifthCategory = async () => {
    const newValue = !useFifthCategory;
    setUseFifthCategory(newValue);

    await updateUseFithCategory(monthId, newValue);
  };

  const visibleCategories = useMemo(() => {
    return useFifthCategory
      ? data.categories
      : data.categories.filter((c) => c.id !== 5);
  }, [data.categories, useFifthCategory]);

  const isLocked = data.status === "locked";
  const isConfirmed = data.status === "confirmed";

  const categoryRows = Math.ceil(visibleCategories.length / 3);
  const columnsHeightRem = categoryRows * 28.125 + (categoryRows - 1) * 1;

  const validateCategories = () => {
    const isFourCategories = visibleCategories.length === 4;

    return visibleCategories.filter((category) => {
      const count = data.assignments.filter(
        (a) => a.category_id === category.id,
      ).length;

      if (isFourCategories && category.id === 4) {
        return count % 4 !== 0 || count === 0;
      }

      return count !== 8;
    });
  };

  const invalidCategories = validateCategories();
  const isValid = invalidCategories.length === 0;

  const dndDisabled = isLocked || isConfirmed;

  const handleAssign = (playerId: number, categoryId: number) => {
    if (dndDisabled) return;

    setData((prev) => {
      const newAssignments = prev.assignments.filter(
        (a) => a.player_id !== playerId,
      );
      newAssignments.push({
        id: Math.random(),
        category_id: categoryId,
        player_id: playerId,
        month_id: monthId,
      });

      return { ...prev, assignments: newAssignments };
    });
    setHasChanges(true);
  };

  const handleUnassign = (playerId: number) => {
    if (dndDisabled) return;

    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a.player_id !== playerId),
    }));
    setHasChanges(true);
  };

  const onSave = async () => {
    setIsSaving(true);

    const result = await saveAssignments(monthId, data.assignments);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setHasChanges(false);
    setIsSaving(false);
    toast.info("Cambios guardados correctamente");
  };

  const onConfirm = async () => {
    if (!isValid) {
      toast.warning(
        "Todos las categorías deben tener 8 jugadores para confirmar.",
      );
      return;
    }

    setIsSaving(true);
    const saveResult = await saveAssignments(monthId, data.assignments);
    if (!saveResult.success) {
      toast.error(saveResult.error);
      return;
    }

    const confirmResult = await confirmMonth(monthId);
    if (!confirmResult.success) {
      toast.error(confirmResult.error);
      return;
    }

    setIsSaving(false);
    toast.success("Mes confirmado correctamente");
  };

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            {isLocked || isConfirmed ? (
              <Badge
                variant="outline"
                className="border-warning bg-warning/30 text-warning gap-2 px-2 py-4"
              >
                <Lock />
                Mes Cerrado
              </Badge>
            ) : (
              <div className="flex flex-col">
                <span className="text-sm">
                  {hasChanges
                    ? "Tienes cambios sin guardar"
                    : "Sin cambios pendientes"}
                </span>
                {!isValid && (
                  <span className="text-xs text-destructive font-medium">
                    Cantidad errónea en:{" "}
                    {invalidCategories.map((c) => c.name).join(", ")}
                  </span>
                )}
              </div>
            )}
          </div>

          {!isLocked && !isConfirmed && (
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <label className="flex items-center gap-2 text-sm">
                <span className="text-right">Fusionar 4ª y 5ª categoría</span>
                <Checkbox
                  checked={!useFifthCategory}
                  onCheckedChange={handleToggleFifthCategory}
                />
              </label>

              <Button
                variant="secondary"
                onClick={onSave}
                disabled={!hasChanges || isSaving}
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Guardar Borrador"
                )}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button disabled={isSaving || !isValid}>
                      {isSaving ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Confirmar y Cerrar"
                      )}
                    </Button>
                  }
                ></AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción confirmará estas asignaciones de manera
                      permanente. No se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isSaving}>
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onConfirm}
                      disabled={isSaving || !isValid}
                    >
                      {isSaving ? "Guardando..." : "Sí, confirmar"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          <UnassignedColumn
            players={data.players.filter(
              (p) => !data.assignments.some((a) => a.player_id === p.id),
            )}
            onDrop={(item: DragItem) => handleUnassign(item.id)}
            disabled={dndDisabled}
            heightRem={columnsHeightRem}
          />

          <div className="flex-1 w-full md:w-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
              {visibleCategories.map((category) => (
                <CategoryColumn
                  key={category.id}
                  category={category}
                  capacityLabel={
                    category.id === 4 && !useFifthCategory ? "?" : "8"
                  }
                  assignedPlayers={data.players.filter((p) =>
                    data.assignments.find(
                      (a) =>
                        a.player_id === p.id && a.category_id === category.id,
                    ),
                  )}
                  assignments={data.assignments}
                  onDrop={(item) => handleAssign(item.id, category.id)}
                  disabled={dndDisabled}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
