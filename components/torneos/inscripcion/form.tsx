"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";
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
    <Button
      className="w-fit font-bold"
      type="submit"
      variant="secondary"
      disabled={pending}
    >
      {pending ? "Inscribiendo..." : "Confirmar Inscripción"}
    </Button>
  );
}

export default function Form({
  torneo_id,
  categories,
}: {
  torneo_id: string;
  categories: string[] | null | undefined;
}) {
  const categoriesNeeded = Boolean(categories && categories.length > 0);

  const inscribirTorneoWithCategories = async (
    prevState: InscripcionState,
    formData: FormData,
  ) => {
    return inscribirTorneo(prevState, formData, categoriesNeeded);
  };

  const [state, formAction] = useActionState(
    inscribirTorneoWithCategories,
    initialState,
  );

  const [feedback, setFeedback] = useState<InscripcionState>(initialState);
  const pathname = usePathname();

  useEffect(() => {
    setFeedback(state);
  }, [state]);

  useEffect(() => {
    setFeedback(initialState);
  }, [pathname]);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 mb-8 items-center md:w-1/2 mx-auto px-4 md:px-0"
    >
      <input type="hidden" name="torneo_id" value={torneo_id} />

      {categories && categories.length > 0 && (
        <div className="grid gap-2 w-full">
          <Label htmlFor="category" className="font-semibold">
            Categoría
          </Label>

          <div className="relative">
            <select
              id="category"
              name="category"
              required
              defaultValue=""
              className="
                flex h-10 w-full appearance-none items-center rounded-md
                border bg-background px-3 pr-10 text-sm
                focus:outline-none
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full justify-between">
        <div className="grid gap-2 md:w-1/2 bg-primary rounded-lg p-4 shadow-card">
          <Label className="font-bold" htmlFor="player_1_full_name">
            Jugador 1
          </Label>
          <Input
            id="player_1_full_name"
            name="player_1_full_name"
            type="text"
            placeholder="Nombre y Apellidos"
            required
            className="border-border bg-background/50"
          />
        </div>

        <div className="grid gap-2 md:w-1/2 bg-primary rounded-lg p-4 shadow-card">
          <Label className="font-bold" htmlFor="player_2_full_name">
            Jugador 2
          </Label>
          <Input
            id="player_2_full_name"
            name="player_2_full_name"
            type="text"
            placeholder="Nombre y Apellidos"
            required
            className="border-border bg-background/50"
          />
        </div>
      </div>

      <div className="grid gap-2 w-full">
        <Label className="font-bold" htmlFor="phone_number">
          Teléfono de Contacto
        </Label>
        <Input
          id="phone_number"
          name="phone_number"
          type="tel"
          placeholder="600 00 00 00"
          required
        />
        <p className="text-xs opacity-70">
          Te contactaremos a este número para confirmar detalles.
        </p>
      </div>

      {feedback?.error && (
        <div className="p-3 text-sm text-error bg-error/20 border border-error rounded">
          {feedback.error}
        </div>
      )}

      {feedback?.success && (
        <div className="p-3 text-sm text-success bg-success/20 border border-success rounded">
          {feedback.message}
        </div>
      )}

      {!feedback?.success && <SubmitButton />}
    </form>
  );
}
