import { getPlayersByPartido } from "@/app/actions/partidos";
import ResultsForm from "@/components/liga/admin/resultados/results-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const matchId = Number(id);

  const players = await getPlayersByPartido(matchId);

  return <ResultsForm partidoId={matchId} players={players} />;
}
