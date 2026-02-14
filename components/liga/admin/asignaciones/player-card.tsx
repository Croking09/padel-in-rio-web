"use client";

import { useDrag, DragSourceMonitor } from "react-dnd";
import { Player } from "@/app/actions/monthly-assignment";
import { cn } from "@/lib/utils";

interface PlayerCardProps {
  player: Player;
  assignmentId?: number;
  className?: string;
  isDraggable?: boolean;
}

export default function PlayerCard({
  player,
  assignmentId,
  className,
  isDraggable = true,
}: PlayerCardProps) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "PLAYER",
      item: { id: player.id, assignmentId, type: "PLAYER" },
      canDrag: isDraggable,
      collect: (monitor: DragSourceMonitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [isDraggable, player.id, assignmentId],
  );

  const dragRef = (node: HTMLDivElement | null) => {
    drag(node);
  };

  return (
    <div
      ref={dragRef}
      className={cn(
        "p-2 bg-primary border border-border rounded shadow-sm hover:shadow-md transition-shadow select-none",
        isDraggable ? "cursor-move" : "cursor-default opacity-80",
        isDragging ? "opacity-50" : "opacity-100",
        className,
      )}
    >
      <div className="font-medium text-sm truncate">{player.full_name}</div>
    </div>
  );
}
