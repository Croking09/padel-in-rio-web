import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { TournamentMatchRow } from "@/lib/types/tournament-match";
import { capitalize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import EditMatch from "@/components/torneos/matches/edit-match";
import { TournamentRow } from "@/lib/types/tournament";

export default function MatchCard({
  match,
  tournament,
  showAdminControls,
}: {
  match: TournamentMatchRow;
  tournament: TournamentRow;
  showAdminControls: boolean;
}) {
  const result = match.result ?? [];

  return (
    <Card className="h-full gap-0">
      <CardHeader className="flex items-center justify-between gap-4 border-b">
        <div className="flex items-center gap-2 font-medium text-muted-foreground">
          <CalendarDays className="size-4" />
          <CardDescription>
            {capitalize(
              format(new Date(match.scheduled_datetime), "EEE · HH:mm", {
                locale: es,
              }),
            )}
          </CardDescription>
        </div>

        {match.category && <Badge variant="secondary">{match.category}</Badge>}
      </CardHeader>

      <CardContent className="flex justify-between pt-4">
        <div className="space-y-4">
          <p className="truncate font-medium">{match.pair1.join(" / ")}</p>
          <p className="truncate font-medium">{match.pair2.join(" / ")}</p>
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="grid gap-x-4"
            style={{ gridTemplateColumns: `repeat(${result.length}, 2rem)` }}
          >
            {result.map((set, index) => (
              <span key={index} className="text-center font-bold tabular-nums">
                {set[0]}
              </span>
            ))}
          </div>

          <div
            className="grid gap-x-4"
            style={{ gridTemplateColumns: `repeat(${result.length}, 2rem)` }}
          >
            {result.map((set, index) => (
              <span key={index} className="text-center font-bold tabular-nums">
                {set[1]}
              </span>
            ))}
          </div>
        </div>
      </CardContent>

      {showAdminControls && (
        <CardFooter className="justify-end gap-2 pt-4">
          <EditMatch tournament={tournament} match={match} />
          <Button>Añadir resultado</Button> {/* Just a placeholder */}
        </CardFooter>
      )}
    </Card>
  );
}
