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

  return <ResultsView sets={sets} participation={participation} />;
}
