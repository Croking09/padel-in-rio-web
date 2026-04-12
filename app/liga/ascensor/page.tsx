import { getAscensor } from "@/app/actions/clasificacion";
import { CategoryClassification } from "@/lib/types/classification";
import { CategoryTable } from "@/components/liga/ascensor/category-table";
import MonthSelector from "@/components/liga/admin/asignaciones/month-selector";
import { getMonths } from "@/app/actions/monthly-assignment";

interface PageProps {
  searchParams: Promise<{ monthId?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const sP = await searchParams;

  const allMonths = await getMonths();
  const confirmedMonths = allMonths.filter((m) => m.status === "confirmed");
  const orderedConfirmedMonths = [...confirmedMonths].sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month,
  );

  const today = new Date();
  const currentMonthNumber = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const monthId = sP.monthId
    ? Number(sP.monthId)
    : (orderedConfirmedMonths.find(
        (m) => m.month === currentMonthNumber && m.year === currentYear,
      )?.id ??
      orderedConfirmedMonths.at(-1)?.id ??
      1);

  const data: CategoryClassification[] = await getAscensor(monthId);
  const sorted = [...data].sort((a, b) => a.category.id - b.category.id);

  return (
    <div className="max-w-[90%] mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Ascensor</h1>

        {orderedConfirmedMonths.length > 0 && (
          <MonthSelector
            months={orderedConfirmedMonths}
            currentMonthId={monthId}
          />
        )}
      </div>

      {orderedConfirmedMonths.length === 0 ? (
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
