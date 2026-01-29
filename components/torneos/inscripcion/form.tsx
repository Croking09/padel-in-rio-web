"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { inscribirTorneo } from "@/app/actions/torneos";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InscripcionState } from "./types";

const initialState: InscripcionState = {
  message: "",
  error: "",
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Inscribiendo..." : "Confirmar Inscripción"}
    </Button>
  );
}

export default function Form({ torneo_id }: { torneo_id: string }) {
  const [state, formAction] = useActionState(inscribirTorneo, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="torneo_id" value={torneo_id} />

      <div className="grid gap-2">
        <Label htmlFor="phone_number">Número de Teléfono</Label>
        <Input
          id="phone_number"
          name="phone_number"
          type="tel"
          placeholder="+34 600 000 000"
          required
        />
        <p className="text-xs text-muted-foreground">
          Te contactaremos a este número para confirmar detalles.
        </p>
      </div>

      {state?.error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3 text-sm text-green-500 bg-green-50 border border-green-200 rounded">
          {state.message}
        </div>
      )}

      {!state?.success && <SubmitButton />}
    </form>
  );
}
