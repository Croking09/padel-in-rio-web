"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  torneoId: string;
  startDate: string;
  inscriptionEndDate: string;
  manuallyClosed: boolean;
}

export default function InscripcionButton({
  torneoId,
  startDate,
  inscriptionEndDate,
  manuallyClosed,
}: Props) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setNow(new Date());
  }, []);

  if (new Date(startDate) <= now) return null;

  const inscriptionsClosed =
    new Date(inscriptionEndDate) < now || manuallyClosed;

  return inscriptionsClosed ? (
    <Button className="w-fit font-bold" variant="secondary" disabled>
      INSCRIPCIONES CERRADAS
    </Button>
  ) : (
    <Button asChild className="w-fit font-bold" variant="secondary">
      <Link href={`/torneos/inscripcion/${torneoId}`}>INSCRIBIRSE</Link>
    </Button>
  );
}
