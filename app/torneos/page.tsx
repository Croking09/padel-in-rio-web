import TournamentList from "@/components/torneos/tournament-list";
import { isAdmin } from "@/lib/auth/permissions";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getMyOpenTournamentsInscriptions } from "@/app/actions/inscription-actions";
import { getTournaments } from "@/app/actions/tournament-actions";
import { authServerService } from "@/lib/auth/services/server-service";

export default async function Page() {
  const [tournaments, user] = await Promise.all([
    getTournaments(),
    authServerService.getCurrentUser(),
  ]);

  const showAdminControls = isAdmin(user);

  const inscriptions = user
    ? await getMyOpenTournamentsInscriptions(user.id)
    : [];

  const registeredTournamentIds = new Set(
    inscriptions.map((i) => i.tournament_id),
  );

  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-3 items-center gap-4 pt-8 px-8">
        <div className="hidden md:block" />
        <h1 className="text-4xl font-bold text-center">Nuestros Torneos</h1>
        {showAdminControls ? (
          <Link
            href="/admin/torneos/create-torneo"
            className={buttonVariants({
              variant: "default",
              size: "default",
              className: "md:justify-self-end",
            })}
          >
            <PlusIcon className="h-4 w-4" />
            Crear torneo
          </Link>
        ) : (
          <div className="hidden md:block" />
        )}
      </div>

      <TournamentList
        tournaments={tournaments}
        registeredTournamentIds={registeredTournamentIds}
        showAdminControls={showAdminControls}
      />
    </>
  );
}
