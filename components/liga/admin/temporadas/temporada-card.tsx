"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { TemporadaWithMonths } from "@/lib/types/temporada";
import MonthPill from "./month-pill";
import { formatDate } from "@/lib/utils";

export default function TemporadaCard({
  temporada,
}: {
  temporada: TemporadaWithMonths;
}) {
  const [expanded, setExpanded] = useState(false);

  const statusCounts = useMemo(() => {
    const counts = { draft: 0, locked: 0, confirmed: 0 };
    temporada.months?.forEach((m) => counts[m.status]++);
    return counts;
  }, [temporada.months]);

  const sortedMonths = useMemo(
    () =>
      [...(temporada.months ?? [])].sort((a, b) =>
        a.year !== b.year ? a.year - b.year : a.month - b.month,
      ),
    [temporada.months],
  );

  return (
    <div className="rounded-xl border border-border bg-primary shadow-card overflow-hidden h-full">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-background">
            <CalendarDays className="h-4 w-4" />
          </div>
          <div className="text-left min-w-0">
            <p className="font-semibold leading-tight truncate">
              {temporada.name}
            </p>
            <p className="text-xs text-text-primary/60 mt-0.5">
              Inicio:{" "}
              {formatDate(temporada.start_date.toString(), "dd/MM/yyyy")}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {statusCounts.confirmed > 0 && (
                <span className="text-xs rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 px-2 py-0.5 font-medium">
                  {statusCounts.confirmed} confirmado
                  {statusCounts.confirmed !== 1 ? "s" : ""}
                </span>
              )}
              {statusCounts.locked > 0 && (
                <span className="text-xs rounded-full bg-amber-100 text-amber-600 border border-amber-300 px-2 py-0.5 font-medium">
                  {statusCounts.locked} bloqueado
                  {statusCounts.locked !== 1 ? "s" : ""}
                </span>
              )}
              {statusCounts.draft > 0 && (
                <span className="text-xs rounded-full bg-zinc-100 text-zinc-600 border border-zinc-300 px-2 py-0.5 font-medium">
                  {statusCounts.draft} borrador
                  {statusCounts.draft !== 1 ? "es" : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0 ml-2">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-border">
          {sortedMonths.length === 0 ? (
            <p className="text-sm text-center py-6">Sin meses asignados</p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-4">
              {sortedMonths.map((month) => (
                <MonthPill key={month.id} month={month} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
