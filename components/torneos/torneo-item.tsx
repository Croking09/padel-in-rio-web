import { Torneo } from "@/lib/types/torneo";
import { formatDate } from "@/lib/utils";
import InscriptionButton from "./inscription-button";
import ToggleInscriptionsButton from "./admin/toggle-inscriptions-button";
import DeleteTorneoButton from "./admin/delete-torneo-button";
import Link from "next/link";
import { Eye } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import TorneoImage from "@/components/torneos/torneo-image";

export default function TorneoItem({
  torneo,
  showAdminControls,
  isRegistered,
}: {
  torneo: Torneo;
  showAdminControls: boolean;
  isRegistered: boolean;
}) {
  return (
    <li className="flex flex-col lg:flex-row gap-4 overflow-hidden">
      <div className="relative w-full h-130 md:h-90 md:w-100">
        <TorneoImage imageUrl={torneo.imageUrl} name={torneo.name} />
      </div>

      <div className="flex flex-col lg:p-4 w-full">
        <h2 className="text-2xl font-semibold">{torneo.name}</h2>

        <p className="text-sm text-muted-foreground">
          {formatDate(torneo.start_date)} - {formatDate(torneo.end_date)}
        </p>

        <p className="py-2">{torneo.description}</p>

        <div className="flex flex-col gap-2 w-full max-w-50 items-stretch">
          {!showAdminControls &&
            (isRegistered ? (
              <p className="text-success font-medium">Ya te has inscrito</p>
            ) : (
              <InscriptionButton
                torneoId={torneo.id}
                startDate={torneo.start_date}
                inscriptionEndDate={torneo.inscription_end_date}
                manuallyClosed={torneo.manually_closed}
              />
            ))}

          {showAdminControls && (
            <>
              <Link
                href={`/admin/torneos/${torneo.id}/inscripciones`}
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
                torneoId={torneo.id}
                isClosed={torneo.manually_closed}
              />

              <DeleteTorneoButton torneoId={torneo.id} />
            </>
          )}
        </div>
      </div>
    </li>
  );
}
