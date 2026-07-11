"use client";

import { useState } from "react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { TemporadaWithMonths } from "@/lib/types/temporada";
import MonthPill from "./month-pill";
import TemporadaCardHeader from "./temporada-card-header";

export default function TemporadaCard({
  temporada,
}: {
  temporada: TemporadaWithMonths;
}) {
  const [expanded, setExpanded] = useState(false);

  const sortedMonths = [...(temporada.months ?? [])].sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month,
  );

  return (
    <Card className="overflow-hidden">
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <TemporadaCardHeader temporada={temporada} expanded={expanded} />

        <CollapsibleContent className="pt-8">
          <CardContent className="border-t pt-8">
            {sortedMonths.length === 0 ? (
              <p className="text-muted-foreground text-center">
                Sin meses asignados
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {sortedMonths.map((month) => (
                  <MonthPill key={month.id} month={month} />
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
