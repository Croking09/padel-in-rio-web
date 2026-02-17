import { previewMonth } from "@/app/actions/generador-partidos";
import { getMonths } from "@/app/actions/monthly-assignment";
import ConfirmButton from "@/components/liga/admin/generador/confirm-button";
import MonthSelector from "@/components/liga/admin/asignaciones/month-selector";
import { Match } from "@/lib/utils";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ monthId: string }>;
}) {
  const months = await getMonths();

  const sP = await searchParams;

  let currentMonthId = sP.monthId ? parseInt(String(sP.monthId)) : undefined;

  if (!currentMonthId && months.length > 0) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const currentMonthData = months.find(
      (m) => m.month === currentMonth && m.year === currentYear,
    );

    currentMonthId = currentMonthData?.id ?? months[0].id;
  }

  const selectedMonth = months.find((m) => m.id === currentMonthId);
  const isMonthLocked = selectedMonth?.status === "locked";
  const isMonthConfirmed = selectedMonth?.status === "confirmed";

  const matches =
    currentMonthId && (isMonthLocked || isMonthConfirmed)
      ? await previewMonth(currentMonthId)
      : [];

  const matchesByDay: Record<number, Record<string, Match[]>> = {};

  matches.forEach((match) => {
    if (!matchesByDay[match.matchday]) {
      matchesByDay[match.matchday] = {};
    }
    if (!matchesByDay[match.matchday][match.categoryName]) {
      matchesByDay[match.matchday][match.categoryName] = [];
    }
    matchesByDay[match.matchday][match.categoryName].push(match);
  });

  return (
    <div className="space-y-8 p-8 flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Generador de Partidos</h2>
        <MonthSelector months={months} currentMonthId={currentMonthId} />
      </div>

      {isMonthConfirmed ? (
        <div className="bg-success/20 border-l-4 border-success p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-success">
                Los partidos para este mes ya han sido generados y confirmados.
              </p>
            </div>
          </div>
        </div>
      ) : !isMonthLocked ? (
        <div className="bg-amber-100 border-l-4 border-amber-200 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-amber-600">
                No se pueden generar partidos para un mes sin confirmar. Por
                favor, confirme la asignación de jugadores primero.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {Object.entries(matchesByDay).map(([day, categories]) => (
            <div key={day} className="space-y-4">
              <h3 className="text-xl font-semibold pb-2">Jornada {day}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(categories).map(
                  ([category, categoryMatches]) => (
                    <div
                      key={category}
                      className="p-4 rounded-lg shadow space-y-3 border"
                    >
                      <h4 className="font-medium text-lg">{category}</h4>
                      <div className="space-y-2">
                        {categoryMatches.map((match, idx) => (
                          <div
                            key={idx}
                            className="text-sm bg-primary p-2 rounded border border-border"
                          >
                            <div className="grid grid-cols-2 text-center">
                              {match.players.map((player) => (
                                <p key={player.id} className="truncate">
                                  {player.nickname || player.full_name}
                                </p>
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

          {currentMonthId && (
            <ConfirmButton
              className="w-fit mx-auto hover:cursor-pointer"
              matches={matches}
              monthId={currentMonthId}
            />
          )}
        </>
      )}
    </div>
  );
}
