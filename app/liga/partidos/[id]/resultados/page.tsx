import { getMatchResults } from "@/app/actions/match-actions";
import ResultsView from "@/components/liga/partidos/resultados/results-view";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const sets = await getMatchResults(id);

  return (
    <>
      <h1 className="text-4xl font-bold text-center py-8 px-8 lg:px-0">
        Resultados del partido
      </h1>
      <ResultsView sets={sets} />
    </>
  );
}
