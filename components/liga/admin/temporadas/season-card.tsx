"use client";

import { useState } from "react";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import MonthPill from "./month-pill";
import { SeasonWithMonths } from "@/lib/types/season";
import SeasonCardHeader from "./season-card-header";

export default function SeasonCard({
  season,
}: {
  season: SeasonWithMonths;
}) {
  const [expanded, setExpanded] = useState(false);

  const sortedMonths = [...(season.months ?? [])].sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month,
  );

  return (
    <Card className="overflow-hidden">
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <SeasonCardHeader season={season} expanded={expanded} />

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
