"use client";

import { CalendarDays } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { TemporadaWithMonths } from "@/lib/types/temporada";
import TemporadaCard from "./temporada-card";

export default function TemporadasClient({
  temporadas,
}: {
  temporadas: TemporadaWithMonths[];
}) {
  if (temporadas.length === 0) {
    return (
      <Empty className="border-2 border-dashed">
        <EmptyHeader>
          <EmptyMedia>
            <CalendarDays />
          </EmptyMedia>

          <EmptyTitle>No hay temporadas</EmptyTitle>

          <EmptyDescription>
            Crea la primera temporada para comenzar la liga.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="mx-auto w-full space-y-8">
      {temporadas.map((temporada) => (
        <TemporadaCard key={temporada.id} temporada={temporada} />
      ))}
    </div>
  );
}
