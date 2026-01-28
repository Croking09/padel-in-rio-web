"use client";

import Link from "next/link";
import { Button } from "../ui/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationControls({
  currentPage,
  totalPages,
}: PaginationControlsProps) {
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="flex justify-center items-center gap-4 pb-4">
      {hasPrevious ? (
        <Button asChild>
          <Link href={`/torneos?page=${currentPage - 1}`}>Anterior</Link>
        </Button>
      ) : (
        <Button disabled>Anterior</Button>
      )}

      <span>
        {currentPage} de {totalPages}
      </span>

      {hasNext ? (
        <Button asChild>
          <Link href={`/torneos?page=${currentPage + 1}`}>Siguiente</Link>
        </Button>
      ) : (
        <Button disabled>Siguiente</Button>
      )}
    </div>
  );
}
