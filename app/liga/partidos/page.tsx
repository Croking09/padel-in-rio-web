import { getMonths } from "@/app/actions/monthly-assignment";
import MonthSelector from "@/components/liga/admin/asignaciones/month-selector";
import { HapticButton } from "@/components/ui/haptic-button";
import { getMatchesByDayGlobal } from "@/lib/partidos";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ monthId: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.app_metadata?.admin === true;

  const sP = await searchParams;
  const monthInput = Number(sP.monthId);

  const { matchesByDay, monthId: currentMonthId } =
    await getMatchesByDayGlobal(monthInput);

  const allMonths = await getMonths();
  const confirmedMonths = allMonths.filter((m) => m.status === "confirmed");
  const orderedConfirmedMonths = [...confirmedMonths].sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month,
  );

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
      ) : Object.keys(matchesByDay).length === 0 ? (
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
                              className="bg-primary p-3 rounded-lg border border-border space-y-4"
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

                              <hr className="border-border" />

                              <div className="flex gap-4">
                                <HapticButton asChild variant="secondary">
                                  <Link
                                    href={`/liga/partidos/${match.id}/resultados`}
                                    className="text-xs px-3 py-1"
                                  >
                                    Ver resultados
                                  </Link>
                                </HapticButton>

                                {isAdmin && (
                                  <HapticButton asChild variant="outline">
                                    <Link
                                      href={`/admin/liga/partidos/${match.id}/resultados`}
                                      className="text-xs px-3 py-1"
                                    >
                                      Introducir resultados
                                    </Link>
                                  </HapticButton>
                                )}
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
