"use client";

import { DropTargetMonitor, useDrop } from "react-dnd";
import { useState, useEffect, useMemo } from "react";
import {
  AssignmentData,
  saveAssignments,
  confirmMonth,
  Category,
  Player,
  Assignment,
} from "@/app/actions/monthly-assignment";
import { DndProvider } from "react-dnd";
import {
  TouchTransition,
  MouseTransition,
  MultiBackend,
} from "react-dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import PlayerCard from "./player-card";
import { cn } from "@/lib/utils";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { MonthStatus } from "@/lib/types/month";
import { Checkbox } from "@/components/ui/checkbox";
import { updateUseFithCategory } from "@/app/actions/ligas";

interface AssignmentBoardProps {
  initialData: AssignmentData;
  monthId: number;
}

interface DragItem {
  id: number;
  assignmentId?: number;
  type: string;
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

  useEffect(() => {
    setData(initialData);
    setHasChanges(false);
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

  const isLocked = data.status === MonthStatus.Locked;
  const isConfirmed = data.status === MonthStatus.Confirmed;

  const validateCategories = () => {
    const isFourCategories = visibleCategories.length === 4;

    return visibleCategories.filter((category) => {
      const count = data.assignments.filter(
        (a) => a.categoria_id === category.id,
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
        (a) => a.jugador_id !== playerId,
      );
      newAssignments.push({
        jugador_id: playerId,
        categoria_id: categoryId,
        id: Math.random(),
      });

      return { ...prev, assignments: newAssignments };
    });
    setHasChanges(true);
  };

  const handleUnassign = (playerId: number) => {
    if (dndDisabled) return;

    setData((prev) => {
      return {
        ...prev,
        assignments: prev.assignments.filter((a) => a.jugador_id !== playerId),
      };
    });
    setHasChanges(true);
  };

  const onSave = async () => {
    setIsSaving(true);
    try {
      await saveAssignments(monthId, data.assignments);
      setHasChanges(false);
      toast.info("Cambios guardados correctamente");
    } catch {
      toast.error("Error al guardar cambios");
    } finally {
      setIsSaving(false);
    }
  };

  const onConfirm = async () => {
    if (!isValid) {
      toast.warning(
        "Todos las categorías deben tener 8 jugadores para confirmar."
      );
      return;
    }

    setIsSaving(true);
    try {
      await saveAssignments(monthId, data.assignments);
      await confirmMonth(monthId);

      toast.success("Mes confirmado correctamente");
    } catch {
      toast.error("Error al confirmar mes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DndProvider backend={MultiBackend} options={HTML5toTouch}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2">
            {isLocked || isConfirmed ? (
              <div className="flex items-center text-amber-600 font-medium px-3 py-1 bg-amber-100 rounded-full border border-amber-200">
                <Lock className="w-4 h-4 mr-2" />
                Mes Cerrado
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-sm">
                  {hasChanges
                    ? "Tienes cambios sin guardar"
                    : "Sin cambios pendientes"}
                </span>
                {!isValid && (
                  <span className="text-xs text-error font-medium">
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
                <span>Fusionar 4ª y 5ª categoría</span>
                <Checkbox
                  checked={!useFifthCategory}
                  onCheckedChange={handleToggleFifthCategory}
                />
              </label>
              <Button
                onClick={() => {
                  onSave();
                }}
                disabled={!hasChanges || isSaving}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  hasChanges
                    ? "hover:cursor-pointer"
                    : "cursor-not-allowed opacity-50",
                  isSaving && "opacity-70 cursor-wait",
                )}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Guardar Borrador"
                )}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={isSaving || !isValid}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-md bg-success text-white shadow-sm flex items-center gap-2",
                      !isValid
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-success/80 hover:cursor-pointer",
                    )}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Confirmar y Cerrar"
                    )}
                  </Button>
                </AlertDialogTrigger>

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
                      variant="secondary"
                    >
                      {isSaving ? "Guardando..." : "Sí, confirmar"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          <UnassignedColumn
            players={data.players.filter(
              (p) => !data.assignments.some((a) => a.jugador_id === p.id),
            )}
            onDrop={(item: DragItem) => handleUnassign(item.id)}
            disabled={dndDisabled}
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
                        a.jugador_id === p.id && a.categoria_id === category.id,
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

function UnassignedColumn({
  players,
  onDrop,
  disabled,
}: {
  players: Player[];
  onDrop: (item: DragItem) => void;
  disabled: boolean;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "PLAYER",
    canDrop: () => !disabled,
    drop: (item: DragItem) => onDrop(item),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const dropRef = (node: HTMLDivElement | null) => {
    if (node) drop(node);
  };

  return (
    <div
      ref={dropRef}
      className={cn(
        "w-full md:w-64 flex flex-col border rounded-lg transition-colors top-20 h-screen overflow-y-auto",
        isOver && canDrop ? "bg-primary/10" : "",
        disabled && "cursor-not-allowed opacity-75",
      )}
    >
      <div className="p-3 border-b font-semibold">
        Sin Asignar ({players.length})
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scroll">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} isDraggable={!disabled} />
        ))}
      </div>
    </div>
  );
}

function CategoryColumn({
  category,
  capacityLabel,
  assignedPlayers,
  assignments,
  onDrop,
  disabled,
}: {
  category: Category;
  capacityLabel: string;
  assignedPlayers: Player[];
  assignments: Assignment[];
  onDrop: (item: DragItem) => void;
  disabled: boolean;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "PLAYER",
    canDrop: () => !disabled,
    drop: (item: DragItem) => onDrop(item),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const dropRef = (node: HTMLDivElement | null) => {
    if (node) drop(node);
  };

  return (
    <div
      ref={dropRef}
      className={cn(
        "flex flex-col border rounded-lg h-112.5 shadow-sm transition-colors",
        isOver && canDrop ? "ring-2 ring-primary" : "",
        disabled && "opacity-75 cursor-not-allowed",
      )}
    >
      <div className="p-3 border-b font-semibold flex justify-between items-center">
        <span>{category.name}</span>
        <span className="text-xs px-2 py-1 rounded-full">
          {assignedPlayers.length}/{capacityLabel}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scroll">
        {assignedPlayers.map((player) => {
          const assignment = assignments.find(
            (a) => a.jugador_id === player.id && a.categoria_id === category.id,
          );
          return (
            <PlayerCard
              key={player.id}
              player={player}
              assignmentId={assignment?.id}
              isDraggable={!disabled}
            />
          );
        })}
        {Array.from({ length: Math.max(0, 8 - assignedPlayers.length) }).map(
          (_, i) => (
            <div
              key={`empty-${i}`}
              className="h-10 border border-dashed rounded-md items-center justify-center flex text-xs"
            >
              {disabled ? "—" : "Cupo libre"}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
