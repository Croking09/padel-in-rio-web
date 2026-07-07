import { getMatchResults, getMatchParticipation } from "@/app/actions/partidos";

import ResultsView from "@/components/liga/partidos/resultados/results-view";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const matchId = Number(id);

  const [sets, participation] = await Promise.all([
    getMatchResults(matchId),
    getMatchParticipation(matchId),
  ]);

  return (
    <>
      <h1 className="text-4xl font-bold text-center py-8 px-8 lg:px-0">
        Resultados del partido
      </h1>
      <ResultsView sets={sets} participation={participation} />
    </>
  );
}
