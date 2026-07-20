"use client";

import { CalendarDays } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { SeasonWithMonths } from "@/lib/types/season";
import SeasonCard from "./season-card";

export default function SeasonsClient({
  seasons,
}: {
  seasons: SeasonWithMonths[];
}) {
  if (seasons.length === 0) {
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
      {seasons.map((season) => (
        <SeasonCard key={season.id} season={season} />
      ))}
    </div>
  );
}
