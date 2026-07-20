import { getMatchParticipants } from "@/app/actions/match-actions";
import { getAllMembers } from "@/app/actions/member-actions";
import ResultsForm from "@/components/liga/admin/resultados/results-form";
import type { Player } from "@/lib/types/member";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;

  const playersParticipation = await getMatchParticipants(id);
  const players: Player[] = playersParticipation.map((playerParticipation) => ({
    id: playerParticipation.player.id,
    full_name: playerParticipation.player.full_name,
    nickname: playerParticipation.player.nickname,
  }));

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
