import { existResultsBatch } from "@/app/actions/partidos";
import { getMonths, getTemporadas } from "@/app/actions/ligas";
import MonthSelector from "@/components/liga/month-selector";
import MatchCard from "@/components/liga/partidos/match-card";
import { getMatchesByDayGlobal } from "@/lib/liga/partidos";
import { createClient } from "@/lib/supabase/server";
import { resolveActiveMonth } from "@/lib/liga/resolve-active-month";
import { isAdmin } from "@/lib/auth/permissions";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarX2 } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import EmptyMonths from "@/components/liga/empty-months";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ monthId?: string; temporadaId?: string }>;
}) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  const showAdminControls = isAdmin(user);

  const [allMonths, temporadas, params] = await Promise.all([
    getMonths(),
    getTemporadas(),
    searchParams,
  ]);

  const { activeTemporadaId, months, confirmedMonths, currentMonthId } =
    resolveActiveMonth(allMonths, temporadas, params);

  const { matchesByDay } = await getMatchesByDayGlobal(
    Number(currentMonthId),
    activeTemporadaId,
  );

  const matchIds = Object.values(matchesByDay)
    .flatMap((categories) => Object.values(categories))
    .flat()
    .map((match) => match.id)
    .filter((id): id is number => typeof id === "number");

  const resultIds = await existResultsBatch(matchIds);
  const matchesWithResults = new Set(resultIds);

  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-3 items-center py-8 md:px-8 lg:px-24">
        <div />

        <h1 className="text-4xl font-bold text-center pb-4 md:pb-0">
          Partidos de Liga
        </h1>

        {months.length > 0 ? (
          <div className="justify-self-end">
            <MonthSelector months={months} currentMonthId={currentMonthId} />
          </div>
        ) : (
          <div />
        )}
      </div>

      <div className="px-4 md:px-8 lg:px-24 pb-8">
        {confirmedMonths.length === 0 ? (
          <EmptyMonths />
        ) : Object.keys(matchesByDay).length === 0 ? (
          <Empty className="border-2 border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CalendarX2 />
              </EmptyMedia>
              <EmptyTitle>No se encontraron partidos</EmptyTitle>
              <EmptyDescription>
                No hay partidos programados para el mes seleccionado.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-8">
            {Object.entries(matchesByDay)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([day, categories]) => (
                <div key={day} className="space-y-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold min-w-max">
                      Jornada {day}
                    </h2>
                    <div className="w-full">
                      <Separator />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(categories).map(
                      ([category, categoryMatches]) => (
                        <Card
                          key={category}
                          className="flex flex-col overflow-hidden py-0 gap-0"
                        >
                          <CardHeader className="px-4 py-2 border-b gap-0 [.border-b]:pb-2">
                            <CardTitle className="font-bold text-lg">
                              {category}
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="p-4 space-y-4 last:pb-4">
                            {categoryMatches.map((match, idx) => (
                              <MatchCard
                                key={idx}
                                match={match}
                                hasResults={
                                  typeof match.id === "number" &&
                                  matchesWithResults.has(match.id)
                                }
                                showAdminControls={showAdminControls}
                              />
                            ))}
                          </CardContent>
                        </Card>
                      ),
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}
