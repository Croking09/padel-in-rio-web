import { SetWithPlayers } from "@/app/actions/partidos";
import MatchParticipants from "@/lib/types/matchParticipants";
import { ClipboardX } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import SetCard from "@/components/liga/partidos/set-card";

export default function ResultsView({
  sets,
  participation,
}: {
  sets: SetWithPlayers[];
  participation: MatchParticipants[];
}) {
  if (!sets.length) {
    return (
      <div className="max-w-5xl mx-auto">
        <Empty className="border-2 border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ClipboardX />
            </EmptyMedia>
            <EmptyTitle>No hay resultados para este partido</EmptyTitle>
            <EmptyDescription>
              Cuando se registren los resultados, aparecerán aquí.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  function isAbsent(playerId: number) {
    return participation.some(
      (p) => p.jugador_id === playerId && p.sustituto_id !== null,
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pb-8 px-8 lg:px-0">
      {sets.map((set) => (
        <SetCard
          key={set.orden}
          title={`Set ${set.orden}`}
          team1={{
            players: [
              {
                id: set.pareja1[0].id,
                name: set.pareja1[0].nickname ?? set.pareja1[0].full_name,
                absent: isAbsent(set.pareja1[0].id),
              },
              {
                id: set.pareja1[1].id,
                name: set.pareja1[1].nickname ?? set.pareja1[1].full_name,
                absent: isAbsent(set.pareja1[1].id),
              },
            ],
            score: (
              <span className="min-w-10 text-right text-2xl font-semibold">
                {set.pareja1_juegos}
              </span>
            ),
          }}
          team2={{
            players: [
              {
                id: set.pareja2[0].id,
                name: set.pareja2[0].nickname ?? set.pareja2[0].full_name,
                absent: isAbsent(set.pareja2[0].id),
              },
              {
                id: set.pareja2[1].id,
                name: set.pareja2[1].nickname ?? set.pareja2[1].full_name,
                absent: isAbsent(set.pareja2[1].id),
              },
            ],
            score: (
              <span className="min-w-10 text-right text-2xl font-semibold">
                {set.pareja2_juegos}
              </span>
            ),
          }}
        />
      ))}
    </div>
  );
}
