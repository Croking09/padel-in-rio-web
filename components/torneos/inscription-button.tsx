"use client";

import { buttonVariants, Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  torneoId: number;
  startDate: string;
  inscriptionEndDate: string;
  manuallyClosed: boolean;
}

export default function InscriptionButton({
  torneoId,
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
      href={`/torneos/inscripcion/${torneoId}`}
      className={buttonVariants({ variant: "default", size: "default" })}
    >
      Inscribirse
    </Link>
  );
}
