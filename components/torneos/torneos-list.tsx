"use client";

import { useMemo, useState } from "react";
import { Torneo } from "@/lib/types/torneo";
import TorneoItem from "./torneo-item";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 4;

export default function TorneosList({
  torneos,
  registeredTorneosIds,
  showAdminControls,
}: {
  torneos: Torneo[];
  registeredTorneosIds: Set<number>;
  showAdminControls: boolean;
}) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(torneos.length / PAGE_SIZE);

  const currentTorneos = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return torneos.slice(start, start + PAGE_SIZE);
  }, [page, torneos]);

  if (torneos.length === 0) {
    return <p className="p-8 text-center">No hay torneos.</p>;
  }

  return (
    <>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 p-8">
        {currentTorneos.map((torneo) => (
          <TorneoItem
            key={torneo.id}
            torneo={torneo}
            showAdminControls={showAdminControls}
            isRegistered={registeredTorneosIds.has(torneo.id)}
          />
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination className="pb-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text="Anterior"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => {
              const pageNumber = i + 1;

              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={page === pageNumber}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                text="Siguiente"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
