import { getMonths, getTemporadas } from "@/app/actions/ligas";
import { getAssignmentData } from "@/app/actions/monthly-assignment";
import AssignmentBoard from "@/components/liga/admin/asignaciones/assignment-board";
import MonthSelector from "@/components/liga/month-selector";
import { getCurrentMonthId } from "@/lib/utils";

export default async function AssignmentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [allMonths, temporadas, params] = await Promise.all([
    getMonths(),
    getTemporadas(),
    searchParams,
  ]);

  const temporadaIdParam = params.temporadaId
    ? Number(params.temporadaId)
    : undefined;
  const activeTemporadaId = temporadaIdParam ?? temporadas.at(0)?.id ?? 0;

  const months = allMonths.filter((m) => m.temporada_id === activeTemporadaId);

  const monthIdParam = params.monthId ? Number(params.monthId) : undefined;
  const currentMonthId =
    monthIdParam ?? getCurrentMonthId(months) ?? months.at(0)?.id;

  if (!currentMonthId) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold pb-8">Asignación de Jugadores</h2>
        <div className="text-center py-25 rounded-lg border-2 border-dashed">
          <p>No hay meses confirmados para mostrar.</p>
        </div>
      </div>
    );
  }

  const data = await getAssignmentData(currentMonthId);

  return (
    <div className="container mx-auto p-8 flex flex-col gap-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Asignación de Jugadores</h2>
        <MonthSelector months={months} currentMonthId={currentMonthId} />
      </div>

      <AssignmentBoard
        initialData={data}
        monthId={currentMonthId}
        key={currentMonthId}
      />
    </div>
  );
}
