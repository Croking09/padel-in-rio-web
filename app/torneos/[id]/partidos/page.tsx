import { getTournamentById } from "@/app/actions/tournament-actions";
import { getMatchesByTournament } from "@/app/actions/tournament-match-actions";
import CreateMatch from "@/components/torneos/matches/create-match";
import MatchList from "@/components/torneos/matches/match-list";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Swords } from "lucide-react";
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

  const matches = await getMatchesByTournament(id);

  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-3 items-center pt-8 px-4 md:px-8 lg:px-24">
        <div />

        <h1 className="text-4xl font-bold text-center pb-4 md:pb-0">
          {tournament.name}
        </h1>

        <div className="justify-self-end">
          <CreateMatch tournament={tournament} />
        </div>
      </div>

      <div className="mx-auto w-full px-4 pb-8 md:px-8 lg:px-24">
        {matches.length === 0 ? (
          <Empty className="border-2 border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Swords />
              </EmptyMedia>
              <EmptyTitle>No hay partidos para mostrar</EmptyTitle>
              <EmptyDescription>
                Cuando se añadan partidos en este torneo podrás verlos aquí.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <MatchList categories={tournament.categories} matches={matches} />
        )}
      </div>
    </>
  );
}
