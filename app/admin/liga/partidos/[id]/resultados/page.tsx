import { getPlayersByPartido } from "@/app/actions/partidos";
import { getAllSocios } from "@/app/actions/socios";
import ResultsForm from "@/components/liga/admin/resultados/results-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const matchId = Number(id);

  const players = await getPlayersByPartido(matchId);
  const allSocios = await getAllSocios();

  return (
    <>
      <h1 className="text-4xl font-bold text-center py-8 px-8 lg:px-0">
        Registrar resultados
      </h1>
      <ResultsForm
        partidoId={matchId}
        players={players}
        allSocios={allSocios}
      />
    </>
  );
}
