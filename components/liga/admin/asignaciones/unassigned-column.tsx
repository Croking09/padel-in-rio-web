"use client";

import { DropTargetMonitor, useDrop } from "react-dnd";
import { Player } from "@/app/actions/monthly-assignment";
import PlayerCard from "./player-card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DragItem } from "./types";

export default function UnassignedColumn({
  players,
  onDrop,
  disabled,
  heightRem,
}: {
  players: Player[];
  onDrop: (item: DragItem) => void;
  disabled: boolean;
  heightRem: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, drop] = useDrop(() => ({
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
      style={{ height: `${heightRem}rem` }}
      className={cn(
        "w-full md:w-64 flex flex-col border rounded-lg transition-colors",
        disabled && "cursor-not-allowed opacity-75",
      )}
    >
      <div className="p-4 border-b font-semibold flex items-center justify-between">
        <span>Sin Asignar</span>
        <Badge variant="secondary">{players.length}</Badge>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-2 custom-scroll">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} isDraggable={!disabled} />
        ))}
      </div>
    </div>
  );
}
