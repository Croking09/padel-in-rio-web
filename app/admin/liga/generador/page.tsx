import { previewMonth } from "@/app/actions/generador-partidos";
import ConfirmButton from "@/components/liga/admin/generador/confirm-button";
import MonthSelector from "@/components/liga/month-selector";
import { Match } from "@/lib/types/match";
import { getMonths, getTemporadas } from "@/app/actions/ligas";
import { getCurrentMonthId } from "@/lib/utils";
import { MonthStatus } from "@/lib/types/month";
import { buttonVariants } from "@/components/ui/button";
import { resolveTemporadaId } from "@/lib/liga/resolve-active-month";
import { cookies } from "next/headers";
import EmptyMonths from "@/components/liga/empty-months";
import Link from "next/link";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Check, CircleAlert } from "lucide-react";
import MatchdaysList from "@/components/liga/admin/generador/matchdays-list";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ monthId?: string; temporadaId?: string }>;
}) {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const [allMonths, temporadas, params, cookieStore] = await Promise.all([
    getMonths(),
    getTemporadas(),
    searchParams,
    cookies(),
  ]);

  const activeTemporadaId = resolveTemporadaId(
    [params.temporadaId, cookieStore.get("temporadaId")?.value],
    temporadas,
  );

  const months = allMonths.filter((m) => m.temporada_id === activeTemporadaId);

  const monthIdParam = params.monthId ? Number(params.monthId) : undefined;
  const currentMonthId =
    monthIdParam ?? getCurrentMonthId(months) ?? months.at(0)?.id;

  const selectedMonth = months.find((m) => m.id === currentMonthId);

  const monthIndex = months.findIndex((m) => m.id === currentMonthId);

  if (monthIndex === -1) {
    throw new Error("Mes no encontrado");
  }

  const firstMatchday = monthIndex * 2 + 1;

  const isMonthLocked = selectedMonth?.status === MonthStatus.Locked;
  const isMonthConfirmed = selectedMonth?.status === MonthStatus.Confirmed;

  const showFifthCategory = selectedMonth?.["5_category"] ?? false;

  const matches =
    currentMonthId && (isMonthLocked || isMonthConfirmed)
      ? await previewMonth(currentMonthId)
      : [];

  const filteredMatches = matches.filter((match) => {
    if (showFifthCategory) return true;
    return match.categoryId !== 5 && match.categoryName !== "5ª";
  });

  const matchesByDay: Record<number, Record<string, Match[]>> = {};

  filteredMatches.forEach((match) => {
    const realMatchday = firstMatchday + match.matchday - 1;

    if (!matchesByDay[realMatchday]) {
      matchesByDay[realMatchday] = {};
    }

    if (!matchesByDay[realMatchday][match.categoryName]) {
      matchesByDay[realMatchday][match.categoryName] = [];
    }

    matchesByDay[realMatchday][match.categoryName].push(match);
  });

  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-3 items-center py-8 px-4 md:px-8 lg:px-24">
        <div />

        <h1 className="text-4xl font-bold text-center pb-4 md:pb-0">
          Generador de Partidos
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
        {!currentMonthId ? (
          <EmptyMonths />
        ) : isMonthConfirmed ? (
          <Empty className="border-success/30 bg-success/10">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-success">
                <Check />
              </EmptyMedia>
              <EmptyTitle className="text-success">
                Partidos ya generados
              </EmptyTitle>
              <EmptyDescription className="text-success/90">
                Los partidos para este mes ya han sido generados y confirmados.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : !isMonthLocked ? (
          <Empty className="border-warning/30 bg-warning/10">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-warning">
                <CircleAlert />
              </EmptyMedia>
              <EmptyTitle className="text-warning">
                Mes pendiente de confirmar
              </EmptyTitle>
              <EmptyDescription className="text-warning/90">
                Antes de generar los partidos debes confirmar la asignación de
                jugadores para este mes.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <MatchdaysList matchesByDay={matchesByDay} />
        )}
      </div>

      <div className="flex items-center justify-center gap-2 pb-8">
        {currentMonthId && !isMonthConfirmed && isMonthLocked && (
          <ConfirmButton matches={matches} monthId={currentMonthId} />
        )}

        {isMonthConfirmed && (
          <Link
            href={`/admin/liga/generador/matches-pdf?monthId=${currentMonthId}`}
            target="_blank"
            className={buttonVariants({ variant: "default", size: "default" })}
          >
            Descargar PDF
          </Link>
        )}
      </div>
    </>
  );
}
