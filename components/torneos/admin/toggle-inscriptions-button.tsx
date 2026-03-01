"use client";

import { Button } from "@/components/ui/button";
import { Lock, LockOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleInscriptions } from "@/app/actions/inscripciones";
import { toast } from "sonner";

interface ToggleInscriptionsButtonProps {
  torneoId: number;
  isClosed: boolean;
  className?: string;
}

export default function ToggleInscriptionsButton({
  torneoId,
  isClosed,
  className,
}: ToggleInscriptionsButtonProps) {
  return (
    <Button
      className={cn("w-fit hover:cursor-pointer", className)}
      onClick={async () => {
        const error = await toggleInscriptions(torneoId, !isClosed);

        if (error) {
          toast.error(error.error, { position: "top-center" });
        } else {
          const text = isClosed ? "abiertas" : "cerradas";
          toast.success("Inscripciones " + text + " correctamente", {
            position: "top-center",
          });
        }
      }}
    >
      {isClosed ? (
        <>
          <LockOpen className="h-4 w-4" />
        </>
      ) : (
        <>
          <Lock className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}
