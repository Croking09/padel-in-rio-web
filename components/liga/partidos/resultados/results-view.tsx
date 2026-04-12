import { SetWithPlayers } from "@/app/actions/partidos";
import MatchParticipants from "@/lib/types/matchParticipants";

export default function ResultsView({
  sets,
  participation,
}: {
  sets: SetWithPlayers[];
  participation: MatchParticipants[];
}) {
  if (!sets.length) {
    return (
      <div className="container mx-auto py-8 text-center">
        No hay resultados registrados
      </div>
    );
  }

  function isAbsent(playerId: number) {
    return participation.some(
      (p) => p.jugador_id === playerId && p.sustituto_id !== null,
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold text-center">Resultados del partido</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {sets.map((set) => (
          <div
            key={set.orden}
            className="flex flex-col rounded-xl border overflow-hidden"
          >
            <div className="px-4 py-2 border-b">
              <h3 className="font-bold text-md">Set {set.orden}</h3>
            </div>

            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span
                    className={`font-semibold ${
                      isAbsent(set.pareja1[0].id)
                        ? "line-through opacity-50"
                        : ""
                    }`}
                  >
                    {set.pareja1[0].nickname ?? set.pareja1[0].full_name}
                  </span>

                  <span
                    className={`font-semibold ${
                      isAbsent(set.pareja1[1].id)
                        ? "line-through opacity-50"
                        : ""
                    }`}
                  >
                    {set.pareja1[1].nickname ?? set.pareja1[1].full_name}
                  </span>
                </div>

                <span className="text-2xl font-bold w-16 text-center">
                  {set.pareja1_juegos}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-px bg-border flex-1" />
                <span className="text-xs font-bold">VS</span>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span
                    className={`font-semibold ${
                      isAbsent(set.pareja2[0].id)
                        ? "line-through opacity-50"
                        : ""
                    }`}
                  >
                    {set.pareja2[0].nickname ?? set.pareja2[0].full_name}
                  </span>

                  <span
                    className={`font-semibold ${
                      isAbsent(set.pareja2[1].id)
                        ? "line-through opacity-50"
                        : ""
                    }`}
                  >
                    {set.pareja2[1].nickname ?? set.pareja2[1].full_name}
                  </span>
                </div>

                <span className="text-2xl font-bold w-16 text-center">
                  {set.pareja2_juegos}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
