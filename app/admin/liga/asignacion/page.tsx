import { getAssignmentData } from "@/app/actions/player-assignment-actions";
import AssignmentBoard from "@/components/liga/admin/asignaciones/assignment-board";
import EmptyMonths from "@/components/liga/empty-months";
import MonthSelector from "@/components/liga/month-selector";
import { getActiveMonth } from "@/lib/liga/resolve-month";

export default async function AssignmentPage({
  searchParams,
}: {
  searchParams: Promise<{ monthId?: string; seasonId?: string }>;
}) {
  const { months, currentMonthId } = await getActiveMonth(searchParams);

  const data = currentMonthId ? await getAssignmentData(currentMonthId) : null;

  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-3 items-center py-8 px-4 md:px-8 lg:px-24">
        <div />

        <h1 className="text-4xl font-bold text-center pb-4 md:pb-0">
          Asignación de Categorías
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
        ) : (
          <AssignmentBoard
            key={currentMonthId}
            monthId={currentMonthId}
            initialData={data!}
          />
        )}
      </div>
    </>
  );
}
