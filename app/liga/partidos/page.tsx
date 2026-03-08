import { getConfirmedMatches } from "@/app/actions/partidos";
import { getMonths } from "@/app/actions/monthly-assignment";
import MonthSelector from "@/components/liga/admin/asignaciones/month-selector";
import { Match } from "@/lib/types/match";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ monthId: string }>;
}) {
  const allMonths = await getMonths();
  const confirmedMonths = allMonths.filter((m) => m.status === "confirmed");

  const orderedConfirmedMonths = [...confirmedMonths].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  const sP = await searchParams;
  let currentMonthId = sP.monthId ? parseInt(String(sP.monthId)) : undefined;

  if (!currentMonthId && confirmedMonths.length > 0) {
    currentMonthId = confirmedMonths[0].id;
  }

  const matches = currentMonthId
    ? await getConfirmedMatches(currentMonthId)
    : [];

  const monthIndex = orderedConfirmedMonths.findIndex(
    (m) => m.id === currentMonthId,
  );

  const jornadaOffset = monthIndex >= 0 ? monthIndex * 2 : 0;

  const matchesByDay: Record<number, Record<string, Match[]>> = {};

  matches.forEach((match) => {
    const globalDay = jornadaOffset + match.matchday;

    if (!matchesByDay[globalDay]) {
      matchesByDay[globalDay] = {};
    }
    if (!matchesByDay[globalDay][match.categoryName]) {
      matchesByDay[globalDay][match.categoryName] = [];
    }
    matchesByDay[globalDay][match.categoryName].push(match);
  });

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Partidos de la Liga</h1>
        {confirmedMonths.length > 0 && (
          <MonthSelector
            months={orderedConfirmedMonths}
            currentMonthId={currentMonthId}
          />
        )}
      </div>

      {confirmedMonths.length === 0 ? (
        <div className="text-center py-20 rounded-lg border-2 border-dashed">
          <p>Todavía no hay partidos confirmados.</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-20 rounded-lg border-2 border-dashed">
          <p>No se encontraron partidos para el mes seleccionado.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(matchesByDay)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([day, categories]) => (
              <div key={day} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold min-w-max">
                    Jornada {day}
                  </h2>
                  <div className="h-px bg-border w-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(categories).map(
                    ([category, categoryMatches]) => (
                      <div
                        key={category}
                        className="flex flex-col bg-card rounded-xl shadow-sm border overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b">
                          <h3 className="font-bold text-lg">{category}</h3>
                        </div>

                        <div className="p-4 space-y-4">
                          {categoryMatches.map((match, idx) => (
                            <div
                              key={idx}
                              className="bg-primary p-3 rounded-lg border border-border"
                            >
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {match.players.map((player) => (
                                  <div
                                    key={player.id}
                                    className="flex flex-col"
                                  >
                                    <span className="font-semibold">
                                      {player.nickname || player.full_name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
