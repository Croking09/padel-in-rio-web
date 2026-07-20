import ConfirmButton from "@/components/liga/admin/generador/confirm-button";
import MonthSelector from "@/components/liga/month-selector";
import { buttonVariants } from "@/components/ui/button";
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
import { getActiveMonth } from "@/lib/liga/resolve-month";
import { previewMonth } from "@/app/actions/match-generator-actions";
import { CategoryMatches } from "@/lib/types/match";

const MATCHDAYS_PER_MONTH = 2;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ monthId?: string; seasonId?: string }>;
}) {
  const { months, currentMonthId } = await getActiveMonth(searchParams);

  const selectedMonth = months.find((m) => m.id === currentMonthId);

  const monthIndex = months.findIndex((m) => m.id === currentMonthId);

  const firstMatchday = monthIndex * MATCHDAYS_PER_MONTH + 1;

  const isMonthLocked = selectedMonth?.status === "locked";
  const isMonthConfirmed = selectedMonth?.status === "confirmed";

  const showFifthCategory = selectedMonth?.has_fifth_category ?? false;

  const matches =
    currentMonthId && (isMonthLocked || isMonthConfirmed)
      ? await previewMonth(currentMonthId)
      : [];

  const filteredMatches = matches.filter((match) => {
    if (showFifthCategory) return true;
    return match.category.name !== "5ª";
  });

  const matchesByDay: Record<number, CategoryMatches[]> = {};
  const grouped: Record<number, Record<number, CategoryMatches>> = {};

  filteredMatches.forEach((match) => {
    const realMatchday = firstMatchday + match.matchday - 1;

    grouped[realMatchday] ??= {};
    grouped[realMatchday][match.category.id] ??= {
      category: match.category,
      matches: [],
    };
    grouped[realMatchday][match.category.id].matches.push(match);
  });

  for (const [day, categoriesById] of Object.entries(grouped)) {
    matchesByDay[Number(day)] = Object.values(categoriesById).sort(
      (a, b) => a.category.order - b.category.order,
    );
  }

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
