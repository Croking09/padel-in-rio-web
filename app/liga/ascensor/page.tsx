import { getAscensor } from "@/app/actions/clasificacion";
import { CategoryClassification } from "@/lib/types/classification";
import { CategoryTable } from "@/components/liga/ascensor/category-table";
import MonthSelector from "@/components/liga/month-selector";
import { getMonths, getTemporadas, hasBonusGiven } from "@/app/actions/ligas";
import { getCurrentMonthId } from "@/lib/utils";
import { MonthStatus } from "@/lib/types/month";
import BonusButton from "@/components/liga/ascensor/bonus-button";

interface PageProps {
  searchParams: Promise<{ monthId?: string; temporadaId?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
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

  const confirmedMonths = months
    .filter((m) => m.status === MonthStatus.Confirmed)
    .sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month));

  const monthIdParam = params.monthId ? Number(params.monthId) : undefined;
  const currentMonthId =
    monthIdParam ??
    getCurrentMonthId(confirmedMonths) ??
    confirmedMonths.at(-1)?.id;

  const bonusExists = currentMonthId
    ? await hasBonusGiven(currentMonthId)
    : false;

  const selectedMonth = months.find((m) => m.id === currentMonthId);
  const showFifthCategory = selectedMonth?.["5_category"] ?? false;

  if (!currentMonthId) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold pb-8">Ascensor</h2>
        <div className="text-center py-25 rounded-lg border-2 border-dashed">
          <p>No hay meses confirmados para mostrar.</p>
        </div>
      </div>
    );
  }

  const data: CategoryClassification[] = await getAscensor(currentMonthId);

  const sorted = [...data].sort((a, b) => a.category.id - b.category.id);

  const filtered = sorted.filter((cat) => {
    if (showFifthCategory) return true;
    return cat.category.id !== 5;
  });

  return (
    <div className="max-w-[90%] mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
          <h1 className="text-3xl font-bold">Ascensor</h1>
          {bonusExists ? (
            <span className="opacity-50">(Ya se ha aplicado el bonus)</span>
          ) : (
            <BonusButton
              classification={filtered}
              month_id={currentMonthId}
            ></BonusButton>
          )}
        </div>

        {months.length > 0 && (
          <MonthSelector months={months} currentMonthId={currentMonthId} />
        )}
      </div>

      {confirmedMonths.length === 0 ? (
        <div className="text-center py-25 rounded-lg border-2 border-dashed">
          <p>No hay meses confirmados para mostrar.</p>
        </div>
      ) : sorted.every((cat) => cat.classification.length === 0) ? (
        <div className="text-center py-25 rounded-lg border-2 border-dashed">
          <p>No se encontraron datos para el mes seleccionado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
  );
}
