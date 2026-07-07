import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Match } from "@/lib/types/match";

export default function MatchCard({
  match,
  hasResults,
  showAdminControls,
}: {
  match: Match;
  hasResults: boolean;
  showAdminControls: boolean;
}) {
  return (
    <Card className="bg-secondary p-4 rounded-lg gap-4">
      <div className="grid grid-cols-2 gap-2">
        {match.players.map((player) => (
          <div key={player.id} className="flex flex-col">
            <span className="font-semibold">
              {player.nickname || player.full_name}
            </span>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex gap-4">
        <Link
          href={`/liga/partidos/${match.id}/resultados`}
          className={buttonVariants({ variant: "default", size: "default" })}
        >
          Ver resultados
        </Link>

        {showAdminControls && (
          <Link
            href={`/admin/liga/partidos/${match.id}/resultados`}
            className={buttonVariants({
              variant: hasResults ? "success" : "muted",
              size: "default",
            })}
          >
            {hasResults ? "Registrado" : "Introducir resultados"}
          </Link>
        )}
      </div>
    </Card>
  );
}
