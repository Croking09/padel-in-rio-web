import { CategoryTable } from "@/components/liga/ascensor/category-table";
import MonthSelector from "@/components/liga/month-selector";
import BonusButton from "@/components/liga/ascensor/bonus-button";
import { isAdmin } from "@/lib/auth/permissions";
import { getActiveMonth } from "@/lib/liga/resolve-month";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { SearchX } from "lucide-react";
import EmptyMonths from "@/components/liga/empty-months";
import { authServerService } from "@/lib/auth/services/server-service";
import {
  getAscensor,
  hasBonusGiven,
} from "@/app/actions/classification-actions";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ monthId?: string; seasonId?: string }>;
}) {
  const [{ months, confirmedMonths, currentMonthId }, user] = await Promise.all(
    [getActiveMonth(searchParams), authServerService.getCurrentUser()],
  );

  const showAdminControls = isAdmin(user);

  const [bonusExists, classificationData] = currentMonthId
    ? await Promise.all([
        hasBonusGiven(currentMonthId),
        getAscensor(currentMonthId),
      ])
    : [false, []];

  const selectedMonth = months.find((m) => m.id === currentMonthId);
  const showFifthCategory = selectedMonth?.has_fifth_category ?? false;

  const filtered = showFifthCategory
    ? classificationData
    : classificationData.filter((cat) => cat.category.order !== 5);

  const hasData = classificationData.some(
    (cat) => cat.classification.length > 0,
  );

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
