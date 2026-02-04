import { getTorneos } from "@/app/actions/torneos";
import PaginationControls from "./pagination-controls";
import Image from "next/image";
import InscripcionButton from "./inscripcion-button";
import { formatDate } from "@/lib/utils";

interface TorneosProps {
  page?: number;
}

export default async function Torneos({ page = 1 }: TorneosProps) {
  const { data: torneos, totalPages = 0 } = await getTorneos(page, 4);

  return (
    <>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        {torneos && torneos.length > 0 ? (
          torneos.map((torneo) => {
            return (
              <li
                key={torneo.id}
                className="flex flex-col md:flex-row md:gap-4 overflow-hidden"
              >
                <div className="relative w-full h-120 md:h-64 md:w-64">
                  <Image
                    src={torneo.imageUrl ?? "/torneos/fallback.png"}
                    alt={torneo.name}
                    fill
                    className="object-cover"
                    unoptimized
                    loading="eager"
                  />
                </div>
                <div className="flex flex-col p-4">
                  <h3 className="text-2xl font-bold">{torneo.name}</h3>
                  <p className="text-sm opacity-80">
                    {formatDate(torneo.start_date)} -{" "}
                    {formatDate(torneo.end_date)}
                  </p>
                  <p className="py-2">{torneo.description}</p>
                  <InscripcionButton
                    torneoId={torneo.id}
                    startDate={torneo.start_date}
                    inscriptionEndDate={torneo.inscription_end_date}
                    manuallyClosed={torneo.manually_closed}
                  />
                </div>
              </li>
            );
          })
        ) : (
          <p>No hay torneos.</p>
        )}
      </ul>

      <PaginationControls currentPage={page} totalPages={totalPages} />
    </>
  );
}
