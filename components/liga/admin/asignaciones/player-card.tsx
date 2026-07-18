"use client";

import { useDrag, DragSourceMonitor } from "react-dnd";
import { cn } from "@/lib/utils";
import { Player } from "@/lib/types/member";

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
        "p-2 bg-secondary border border-border rounded-lg select-none",
        isDraggable ? "cursor-move" : "cursor-not-allowed",
        isDragging ? "opacity-50" : "opacity-100",
        className,
      )}
    >
      <p className="font-medium text-sm truncate">
        {player.nickname || player.full_name}
      </p>
      {player.nickname && (
        <p className="text-xs opacity-80 truncate">{player.full_name}</p>
      )}
    </div>
  );
}
