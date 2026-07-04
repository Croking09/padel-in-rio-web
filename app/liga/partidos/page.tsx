import { existsResult } from "@/app/actions/partidos";
import { getMonths, getTemporadas } from "@/app/actions/ligas";
import MonthSelector from "@/components/liga/month-selector";
import { getMatchesByDayGlobal } from "@/lib/partidos";
import { createClient } from "@/lib/supabase/server";
import { MonthStatus } from "@/lib/types/month";
import { getCurrentMonthId } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ monthId?: string; temporadaId?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.app_metadata?.admin === true;

  const [allMonthsRaw, temporadas, params] = await Promise.all([
    getMonths(),
    getTemporadas(),
    searchParams,
  ]);

  const temporadaIdParam = params.temporadaId
    ? Number(params.temporadaId)
    : undefined;
  const activeTemporadaId = temporadaIdParam ?? temporadas.at(0)?.id ?? 0;

  const months = allMonthsRaw.filter(
    (m) => m.temporada_id === activeTemporadaId,
  );
  const confirmedMonths = months.filter(
    (m) => m.status === MonthStatus.Confirmed,
  );

  const monthIdParam = params.monthId ? Number(params.monthId) : undefined;
  const currentMonthId =
    monthIdParam ??
    getCurrentMonthId(confirmedMonths) ??
    confirmedMonths.at(-1)?.id;

  const { matchesByDay } = await getMatchesByDayGlobal(
    Number(currentMonthId),
    activeTemporadaId,
  );

  const matchesWithResults = new Set(
    (
      await Promise.all(
        Object.values(matchesByDay)
          .flatMap((categories) => Object.values(categories))
          .flat()
          .map(async (match) => {
            if (typeof match.id !== "number") return null;

            return {
              id: match.id,
              hasResults: await existsResult(match.id),
            };
          }),
      )
    )
      .filter(
        (match): match is { id: number; hasResults: true } =>
          match?.hasResults === true,
      )
      .map((match) => match.id),
  );

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Partidos de la Liga</h1>

        {months.length > 0 && (
          <MonthSelector months={months} currentMonthId={currentMonthId} />
        )}
      </div>

      {confirmedMonths.length === 0 ? (
        <div className="text-center py-25 px-10 rounded-lg border-2 border-dashed">
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
                          {categoryMatches.map((match, idx) => {
                            const hasResults =
                              typeof match.id === "number" &&
                              matchesWithResults.has(match.id);

                            return (
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
                                  <Button asChild variant="secondary">
                                    <Link
                                      href={`/liga/partidos/${match.id}/resultados`}
                                      className="text-xs px-3 py-1"
                                    >
                                      Ver resultados
                                    </Link>
                                  </Button>

                                  {isAdmin && (
                                    <Button
                                      asChild
                                      variant="outline"
                                      className={
                                        hasResults
                                          ? "border-success bg-success/20 hover:bg-success/40 text-success"
                                          : undefined
                                      }
                                    >
                                      <Link
                                        href={`/admin/liga/partidos/${match.id}/resultados`}
                                        className="text-xs px-3 py-1"
                                      >
                                        {hasResults
                                          ? "Registrado"
                                          : "Introducir resultados"}
                                      </Link>
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
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
