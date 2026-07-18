import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PlayerWithParticipation } from "@/lib/types/member";

type Team = {
  players: [PlayerWithParticipation, PlayerWithParticipation];
  score: ReactNode;
};

export default function SetCard({
  title,
  team1,
  team2,
}: {
  title: string;
  team1: Team;
  team2: Team;
}) {
  return (
    <Card className="py-0 gap-0">
      <CardHeader className="px-4 py-2 border-b gap-0 [.border-b]:pb-2">
        <CardTitle className="font-bold text-lg">{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        <div className="flex items-center justify-between pr-4">
          <div className="space-y-2">
            {team1.players.map((player) => (
              <p
                key={player.id}
                className={cn(
                  "font-medium",
                  player.isAbsent && "line-through opacity-50",
                )}
              >
                {player.nickname ?? player.full_name}
              </p>
            ))}
          </div>

          {team1.score}
        </div>

        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs font-semibold text-muted-foreground">
            VS
          </span>
          <Separator className="flex-1" />
        </div>

        <div className="flex items-center justify-between pr-4">
          <div className="space-y-2">
            {team2.players.map((player) => (
              <p
                key={player.id}
                className={cn(
                  "font-medium",
                  player.isAbsent && "line-through opacity-50",
                )}
              >
                {player.nickname ?? player.full_name}
              </p>
            ))}
          </div>

          {team2.score}
        </div>
      </CardContent>
    </Card>
  );
}
