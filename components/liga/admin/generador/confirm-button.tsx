"use client";

import { confirmMonth } from "@/app/actions/generador-partidos";
import { Button } from "@/components/ui/button";
import { Match } from "@/lib/utils";

export default function ConfirmButton({
  className,
  matches,
  monthId,
}: {
  className?: string;
  matches: Match[];
  monthId: number;
}) {
  return (
    <Button
      className={className}
      variant="secondary"
      onClick={() => confirmMonth(monthId, matches)}
    >
      Confirmar
    </Button>
  );
}
