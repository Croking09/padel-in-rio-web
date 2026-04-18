import { getAscensor } from "@/app/actions/clasificacion";
import { CategoryClassification } from "@/lib/types/classification";
import { CategoryTable } from "@/components/liga/ascensor/category-table";
import MonthSelector from "@/components/liga/month-selector";
import { getMonths, getTemporadas } from "@/app/actions/ligas";
import { getCurrentMonthId } from "@/lib/utils";
import { MonthStatus } from "@/lib/types/month";

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

  if (!currentMonthId) {
    return (
      <div className="text-center py-20 rounded-lg border-2 border-dashed">
        <p>No hay meses confirmados para mostrar.</p>
      </div>
    );
  }

  const data: CategoryClassification[] = await getAscensor(currentMonthId);

  const sorted = [...data].sort((a, b) => a.category.id - b.category.id);

  return (
    <div className="max-w-[90%] mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Ascensor</h1>

        {months.length > 0 && (
          <MonthSelector months={months} currentMonthId={currentMonthId} />
        )}
      </div>

      {confirmedMonths.length === 0 ? (
        <div className="text-center py-20 rounded-lg border-2 border-dashed">
          <p>No hay meses confirmados para mostrar.</p>
        </div>
      ) : sorted.every((cat) => cat.classification.length === 0) ? (
        <div className="text-center py-20 rounded-lg border-2 border-dashed">
          <p>No se encontraron datos para el mes seleccionado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sorted.map((cat) => (
            <CategoryTable key={cat.category.id} data={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
