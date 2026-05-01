import { previewMonth } from "@/app/actions/generador-partidos";
import ConfirmButton from "@/components/liga/admin/generador/confirm-button";
import MonthSelector from "@/components/liga/month-selector";
import { Match } from "@/lib/types/match";
import { HapticButton } from "@/components/ui/haptic-button";
import { getMonths, getTemporadas } from "@/app/actions/ligas";
import { getCurrentMonthId } from "@/lib/utils";
import { MonthStatus } from "@/lib/types/month";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ monthId?: string; temporadaId?: string }>;
}) {
  const [allMonths, temporadas, params] = await Promise.all([
    getMonths(),
    getTemporadas(),
    searchParams,
  ]);

  const temporadaIdParam = params.temporadaId
    ? Number(params.temporadaId)
    : undefined;
  const activeTemporadaId = temporadaIdParam ?? temporadas.at(0)?.id ?? 0;

  const months = allMonths.filter((m) => m.temporada_id === activeTemporadaId);

  const monthIdParam = params.monthId ? Number(params.monthId) : undefined;
  const currentMonthId =
    monthIdParam ?? getCurrentMonthId(months) ?? months.at(0)?.id;

  if (!currentMonthId) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold pb-8">Generador de Partidos</h2>
        <div className="text-center py-25 rounded-lg border-2 border-dashed">
          <p>No hay meses confirmados para mostrar.</p>
        </div>
      </div>
    );
  }

  const selectedMonth = months.find((m) => m.id === currentMonthId);
  const isMonthLocked = selectedMonth?.status === MonthStatus.Locked;
  const isMonthConfirmed = selectedMonth?.status === MonthStatus.Confirmed;

  const showFifthCategory = selectedMonth?.["5_category"] ?? false;

  const matches =
    isMonthLocked || isMonthConfirmed ? await previewMonth(currentMonthId) : [];

  const filteredMatches = matches.filter((match) => {
    if (showFifthCategory) return true;
    return match.categoryId !== 5 && match.categoryName !== "5ª";
  });

  const matchesByDay: Record<number, Record<string, Match[]>> = {};

  filteredMatches.forEach((match) => {
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
          <p className="text-sm text-success">
            Los partidos para este mes ya han sido generados y confirmados.
          </p>
        </div>
      ) : !isMonthLocked ? (
        <div className="bg-amber-100 border-l-4 border-amber-200 p-4">
          <p className="text-sm text-amber-600">
            No se pueden generar partidos para un mes sin confirmar. Por favor,
            confirme la asignación de jugadores primero.
          </p>
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
                            <div className="grid grid-cols-2 pl-2">
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
        </>
      )}

      <div className="flex items-center justify-center gap-2">
        {currentMonthId && !isMonthConfirmed && (
          <ConfirmButton matches={matches} monthId={currentMonthId} />
        )}

        {isMonthConfirmed && (
          <HapticButton asChild variant="secondary">
            <a
              href={`/admin/liga/generador/matches-pdf?monthId=${currentMonthId}`}
              target="_blank"
            >
              Descargar PDF
            </a>
          </HapticButton>
        )}
      </div>
    </div>
  );
}
