import { getPlayersByPartido } from "@/app/actions/partidos";
import { getAllSocios } from "@/app/actions/socios";
import ResultsForm from "@/components/liga/admin/resultados/results-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const { id } = await params;
  const matchId = Number(id);

  const players = await getPlayersByPartido(matchId);
  const allSocios = await getAllSocios();

  return (
    <ResultsForm partidoId={matchId} players={players} allSocios={allSocios} />
  );
}
