import { redirect } from "next/navigation";
import Form from "@/components/torneos/inscripcion/form";
import { Separator } from "@/components/ui/separator";
import { getTournamentById } from "@/app/actions/tournament-actions";
import { format, parseISO } from "date-fns";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) {
    redirect("/torneos");
  }

  const tournamentId = Number(id);

  const tournament = await getTournamentById(tournamentId);

  if (
    !tournament ||
    new Date(tournament.start_date) < new Date() ||
    new Date(tournament.inscription_end_date) < new Date() ||
    tournament.manually_closed
  ) {
    redirect("/torneos");
  }

  return (
    <>
      <h1 className="py-8 text-center text-4xl font-bold">
        Inscripción para: {tournament.name}
      </h1>

      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <p>
            Solo <strong className="underline">una</strong> persona por pareja
            debe inscribirse.
          </p>

          <p className="text-sm">
            El plazo termina el{" "}
            <strong className="underline">
              {format(parseISO(tournament.inscription_end_date), "dd/MM/yyyy")}
            </strong>
            .
          </p>
        </div>

        <div className="mx-auto w-2/3 py-4">
          <Separator />
        </div>

        <Form tournamentId={tournament.id} categories={tournament.categories} />
      </div>
    </>
  );
}
