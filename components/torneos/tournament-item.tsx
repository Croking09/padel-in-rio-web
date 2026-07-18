import InscriptionButton from "./inscription-button";
import ToggleInscriptionsButton from "./admin/toggle-inscriptions-button";
import DeleteTournamentButton from "./admin/delete-tournament-button";
import Link from "next/link";
import { Eye } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import TournamentImage from "@/components/torneos/tournament-image";
import { format, parseISO } from "date-fns";
import { TournamentWithImage } from "@/lib/types/tournament";

export default function TournamentItem({
  tournament,
  showAdminControls,
  isRegistered,
}: {
  tournament: TournamentWithImage;
  showAdminControls: boolean;
  isRegistered: boolean;
}) {
  return (
    <li className="flex flex-col lg:flex-row gap-4 overflow-hidden">
      <div className="relative w-full h-130 md:h-90 md:w-100">
        <TournamentImage
          imageUrl={tournament.imageUrl}
          name={tournament.name}
        />
      </div>

      <div className="flex flex-col lg:p-4 w-full">
        <h2 className="text-2xl font-semibold">{tournament.name}</h2>

        <p className="text-sm text-muted-foreground">
          {format(parseISO(tournament.start_date), "dd/MM/yyyy")} -{" "}
          {format(parseISO(tournament.end_date), "dd/MM/yyyy")}
        </p>

        <p className="py-2">{tournament.description}</p>

        <div className="flex flex-col gap-2 w-full max-w-50 items-stretch">
          {!showAdminControls &&
            (isRegistered ? (
              <p className="text-success font-medium">Ya te has inscrito</p>
            ) : (
              <InscriptionButton
                tournamentId={tournament.id}
                startDate={tournament.start_date}
                inscriptionEndDate={tournament.inscription_end_date}
                manuallyClosed={tournament.manually_closed}
              />
            ))}

          {showAdminControls && (
            <>
              <Link
                href={`/admin/torneos/${tournament.id}/inscripciones`}
                className={buttonVariants({
                  variant: "default",
                  size: "default",
                  className: "w-full flex justify-center items-center gap-2",
                })}
              >
                <Eye className="h-4 w-4" />
                Ver inscripciones
              </Link>

              <ToggleInscriptionsButton
                tournamentId={tournament.id}
                isClosed={tournament.manually_closed}
              />

              <DeleteTournamentButton tournamentId={tournament.id} />
            </>
          )}
        </div>
      </div>
    </li>
  );
}
