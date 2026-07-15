import { getMatchParticipants } from "@/app/actions/match-actions";
import { getAllMembers } from "@/app/actions/member-actions";
import ResultsForm from "@/components/liga/admin/resultados/results-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const players = await getMatchParticipants(id);
  const members = await getAllMembers(true);

  return (
    <>
      <h1 className="text-4xl font-bold text-center py-8 px-8 lg:px-0">
        Registrar resultados
      </h1>
      <ResultsForm matchId={id} players={players} members={members} />
    </>
  );
}
