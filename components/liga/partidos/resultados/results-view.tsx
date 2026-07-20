import { ClipboardX } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import SetCard from "@/components/liga/partidos/set-card";
import { SetWithParticipation } from "@/lib/types/set";

export default function ResultsView({
  sets,
}: {
  sets: SetWithParticipation[];
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pb-8 px-8 lg:px-0">
      {sets.map((set) => (
        <SetCard
          key={set.order}
          title={`Set ${set.order}`}
          team1={{
            players: [set.player1, set.player2],
            score: (
              <span className="min-w-10 text-right text-2xl font-semibold">
                {set.pair1_score}
              </span>
            ),
          }}
          team2={{
            players: [set.player3, set.player4],
            score: (
              <span className="min-w-10 text-right text-2xl font-semibold">
                {set.pair2_score}
              </span>
            ),
          }}
        />
      ))}
    </div>
  );
}
