"use client";

import { CalendarDays, ChevronDown, ChevronUp } from "lucide-react";

import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { CollapsibleTrigger } from "@/components/ui/collapsible";

import { Badge } from "@/components/ui/badge";

import { TemporadaWithMonths } from "@/lib/types/temporada";
import { format } from "date-fns";

export default function TemporadaCardHeader({
  temporada,
  expanded,
}: {
  temporada: TemporadaWithMonths;
  expanded: boolean;
}) {
  const statusCounts = {
    draft: 0,
    locked: 0,
    confirmed: 0,
  };

  temporada.months?.forEach((month) => {
    statusCounts[month.status]++;
  });

  return (
    <CollapsibleTrigger
      render={
        <button className="w-full text-left">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex gap-4 min-w-0">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <CalendarDays />
              </div>

              <div className="min-w-0 space-y-2">
                <CardTitle>{temporada.name}</CardTitle>

                <CardDescription>
                  Inicio: {format(temporada.start_date, "dd/MM/yyyy")}
                </CardDescription>

                <div className="flex flex-wrap gap-2">
                  {statusCounts.confirmed > 0 && (
                    <Badge variant="success">
                      {statusCounts.confirmed} confirmado
                      {statusCounts.confirmed !== 1 ? "s" : ""}
                    </Badge>
                  )}

                  {statusCounts.locked > 0 && (
                    <Badge variant="warning">
                      {statusCounts.locked} bloqueado
                      {statusCounts.locked !== 1 ? "s" : ""}
                    </Badge>
                  )}

                  {statusCounts.draft > 0 && (
                    <Badge variant="outline">
                      {statusCounts.draft} borrador
                      {statusCounts.draft !== 1 ? "es" : ""}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0">
              {expanded ? <ChevronUp /> : <ChevronDown />}
            </div>
          </CardHeader>
        </button>
      }
    ></CollapsibleTrigger>
  );
}
