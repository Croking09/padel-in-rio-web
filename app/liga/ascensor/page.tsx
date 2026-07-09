import { getAscensor } from "@/app/actions/clasificacion";
import { CategoryClassification } from "@/lib/types/classification";
import { CategoryTable } from "@/components/liga/ascensor/category-table";
import MonthSelector from "@/components/liga/month-selector";
import { getMonths, getTemporadas, hasBonusGiven } from "@/app/actions/ligas";
import { resolveActiveMonth } from "@/lib/liga/resolve-active-month";
import BonusButton from "@/components/liga/ascensor/bonus-button";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/permissions";
import { cookies } from "next/headers";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { SearchX } from "lucide-react";
import EmptyMonths from "@/components/liga/empty-months";

interface PageProps {
  searchParams: Promise<{ monthId?: string; temporadaId?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const supabase = await createClient();

  const [allMonths, temporadas, params, cookieStore, { data }] =
    await Promise.all([
      getMonths(),
      getTemporadas(),
      searchParams,
      cookies(),
      supabase.auth.getClaims(),
    ]);

  const user = data?.claims;
  const showAdminControls = isAdmin(user);

  const cookieTemporadaId = cookieStore.get("temporadaId")?.value;

  const { months, confirmedMonths, currentMonthId } = resolveActiveMonth(
    allMonths,
    temporadas,
    params,
    cookieTemporadaId,
  );

  const [bonusExists, classificationData] = currentMonthId
    ? await Promise.all([
        hasBonusGiven(currentMonthId),
        getAscensor(currentMonthId),
      ])
    : [false, [] as CategoryClassification[]];

  const selectedMonth = months.find((m) => m.id === currentMonthId);
  const showFifthCategory = selectedMonth?.["5_category"] ?? false;

  const sorted = [...classificationData].sort(
    (a, b) => a.category.order - b.category.order,
  );

  const filtered = sorted.filter((cat) => {
    if (showFifthCategory) return true;
    return cat.category.name !== "5ª";
  });

  const hasData = sorted.some((cat) => cat.classification.length > 0);

  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-3 items-center py-8 md:px-8 lg:px-24">
        <div />

        <h1 className="text-4xl font-bold text-center pb-4 md:pb-0">
          Ascensor
        </h1>

        {months.length > 0 ? (
          <div className="flex flex-row items-center gap-4 justify-self-end">
            {showAdminControls &&
              currentMonthId &&
              (bonusExists ? (
                <span className="text-muted-foreground">
                  (Ya se ha aplicado el bonus)
                </span>
              ) : (
                <BonusButton
                  classification={filtered}
                  month_id={currentMonthId}
                />
              ))}
            <MonthSelector months={months} currentMonthId={currentMonthId} />
          </div>
        ) : (
          <div />
        )}
      </div>

      <div className="px-4 md:px-8 lg:px-24 pb-8">
        {confirmedMonths.length === 0 ? (
          <EmptyMonths />
        ) : !currentMonthId || !hasData ? (
          <Empty className="border-2 border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchX />
              </EmptyMedia>
              <EmptyTitle>Sin datos para este mes</EmptyTitle>
              <EmptyDescription>
                No se encontraron resultados para el mes seleccionado.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map((cat, idx) => (
              <CategoryTable
                key={cat.category.id}
                data={cat}
                isLast={idx === filtered.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
