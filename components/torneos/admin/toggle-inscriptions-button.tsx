"use client";

import { toggleInscriptions } from "@/app/actions/inscription-actions";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Lock, LockOpen } from "lucide-react";
import { toast } from "sonner";

interface ToggleInscriptionsButtonProps {
  tournamentId: number;
  isClosed: boolean;
}

export default function ToggleInscriptionsButton({
  tournamentId,
  isClosed,
}: ToggleInscriptionsButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="secondary"
            onClick={async () => {
              const result = await toggleInscriptions(tournamentId, !isClosed);

              if (result.error) {
                toast.error(result.error);
              } else {
                const text = isClosed ? "abiertas" : "cerradas";
                toast.success("Inscripciones " + text + " correctamente");
              }
            }}
          >
            {isClosed ? (
              <LockOpen className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
          </Button>
        }
      />
      <TooltipContent>
        {isClosed ? "Abrir inscripciones" : "Cerrar inscripciones"}
      </TooltipContent>
    </Tooltip>
  );
}
