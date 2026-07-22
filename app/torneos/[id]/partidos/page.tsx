import { getTournamentById } from "@/app/actions/tournament-actions";
import CreateMatch from "@/components/torneos/matches/create-match";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const tournament = await getTournamentById(id);

  if (!tournament) {
    redirect("/torneos");
  }

  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-3 items-center py-8 px-4 md:px-8 lg:px-24">
        <div />

        <h1 className="text-4xl font-bold text-center pb-4 md:pb-0">
          {tournament.name}
        </h1>

        <div className="justify-self-end">
          <CreateMatch
            tournamentId={tournament.id}
            categories={tournament.categories}
          />
        </div>
      </div>
    </>
  );
}
