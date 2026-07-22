import ToggleInscriptionsButton from "./admin/toggle-inscriptions-button";
import DeleteTournamentButton from "./admin/delete-tournament-button";
import Link from "next/link";
import { Eye, UserRoundPen } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import TournamentImage from "@/components/torneos/tournament-image";
import { format, parseISO } from "date-fns";
import { TournamentWithImage } from "@/lib/types/tournament";
import { ButtonGroup } from "@/components/ui/button-group";
import { Swords } from "lucide-react";

export default function TournamentItem({
  tournament,
  showAdminControls,
  isRegistered,
}: {
  tournament: TournamentWithImage;
  showAdminControls: boolean;
  isRegistered: boolean;
}) {
  const now = new Date();
  const today = format(now, "yyyy-MM-dd");

  const tournamentStarted = tournament.start_date <= today;

  const inscriptionsClosed =
    tournament.manually_closed ||
    new Date(tournament.inscription_end_date) < now;

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
          {tournamentStarted && (
            <Link
              href={`/torneos/${tournament.id}/partidos`}
              className={buttonVariants({
                variant: "default",
                size: "default",
              })}
            >
              <Swords />
              Partidos
            </Link>
          )}

          {!showAdminControls &&
            (isRegistered ? (
              <p className="text-success font-medium">Ya te has inscrito</p>
            ) : tournamentStarted ? null : inscriptionsClosed ? (
              <Button className="w-fit font-bold" disabled>
                Inscripciones cerradas
              </Button>
            ) : (
              <Link
                href={`/torneos/${tournament.id}/inscripcion`}
                className={buttonVariants({
                  variant: "default",
                  size: "default",
                })}
              >
                <UserRoundPen />
                Inscribirse
              </Link>
            ))}

          {showAdminControls && (
            <>
              <ButtonGroup className="w-full">
                <Link
                  data-slot="button"
                  href={`/admin/torneos/${tournament.id}/inscripciones`}
                  className={buttonVariants({
                    variant: "secondary",
                    size: "default",
                  })}
                >
                  <Eye />
                  Ver inscripciones
                </Link>
                <ToggleInscriptionsButton
                  tournamentId={tournament.id}
                  isClosed={tournament.manually_closed}
                />
              </ButtonGroup>

              <DeleteTournamentButton tournamentId={tournament.id} />
            </>
          )}
        </div>
      </div>
    </li>
  );
}
