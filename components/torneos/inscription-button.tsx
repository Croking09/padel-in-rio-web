"use client";

import { buttonVariants, Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  tournamentId: number;
  startDate: string;
  inscriptionEndDate: string;
  manuallyClosed: boolean;
}

export default function InscriptionButton({
  tournamentId,
  startDate,
  inscriptionEndDate,
  manuallyClosed,
}: Props) {
  const now = new Date();

  if (new Date(startDate) <= now) return null;

  const inscriptionsClosed =
    new Date(inscriptionEndDate) < now || manuallyClosed;

  return inscriptionsClosed ? (
    <Button className="w-fit font-bold" disabled>
      Inscripciones cerradas
    </Button>
  ) : (
    <Link
      href={`/torneos/inscripcion/${tournamentId}`}
      className={buttonVariants({ variant: "default", size: "default" })}
    >
      Inscribirse
    </Link>
  );
}
