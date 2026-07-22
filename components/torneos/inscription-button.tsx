"use client";

import { buttonVariants, Button } from "@/components/ui/button";
import Link from "next/link";
import { UserRoundPen } from "lucide-react";

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
      href={`/torneos/${tournamentId}/inscripcion`}
      className={buttonVariants({ variant: "default", size: "default" })}
    >
      <UserRoundPen />
      Inscribirse
    </Link>
  );
}
