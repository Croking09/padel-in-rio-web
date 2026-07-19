"use client";

import { DropTargetMonitor, useDrop } from "react-dnd";
import PlayerCard from "./player-card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DragItem } from "./types";
import { CategoryRow } from "@/lib/types/category";
import { Player } from "@/lib/types/member";
import { PlayerAssignmentRow } from "@/lib/types/player-assignment";

export default function CategoryColumn({
  category,
  capacityLabel,
  assignedPlayers,
  assignments,
  onDrop,
  disabled,
}: {
  category: CategoryRow;
  capacityLabel: string;
  assignedPlayers: Player[];
  assignments: PlayerAssignmentRow[];
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
        "flex flex-col border rounded-lg h-112.5 transition-colors",
        isOver && canDrop && "ring-2 ring-accent",
        disabled && "opacity-75 cursor-not-allowed",
      )}
    >
      <div className="py-2 px-4 border-b font-semibold flex justify-between items-center">
        <span>{category.name}</span>
        <Badge variant="secondary">
          {assignedPlayers.length}/{capacityLabel}
        </Badge>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-2 custom-scroll">
        {assignedPlayers.map((player) => {
          const assignment = assignments.find(
            (a) => a.player_id === player.id && a.category_id === category.id,
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
              className="h-10 border border-dashed rounded-lg items-center justify-center flex text-xs text-muted-foreground"
            >
              {disabled ? "—" : "Cupo libre"}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
