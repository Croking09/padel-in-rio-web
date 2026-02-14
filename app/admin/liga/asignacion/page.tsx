import { getAssignmentData, getMonths } from "@/app/actions/monthly-assignment";
import AssignmentBoard from "@/components/liga/admin/asignaciones/assignment-board";
import MonthSelector from "@/components/liga/admin/asignaciones/month-selector";

export default async function AssignmentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const months = await getMonths();
  const { monthId } = await searchParams;

  let currentMonthId = monthId ? parseInt(String(monthId)) : undefined;

  if (!currentMonthId && months.length > 0) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const currentMonthData = months.find(
      (m) => m.month === currentMonth && m.year === currentYear,
    );

    currentMonthId = currentMonthData?.id ?? months[0].id;
  }

  if (!currentMonthId) {
    return <div>No hay meses configurados. Por favor crea meses primero.</div>;
  }

  const data = await getAssignmentData(currentMonthId);

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
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
