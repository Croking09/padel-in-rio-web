"use client";

import { useState } from "react";
import { inscribirTorneo } from "@/app/actions/inscripciones";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

export default function Form({
  torneo_id,
  categories,
}: {
  torneo_id: number;
  categories: string[] | null;
}) {
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [category, setCategory] = useState("");

  const categoriesNeeded = Boolean(categories && categories.length > 0);

  const resetForm = () => {
    setPlayer1Name("");
    setPlayer2Name("");
    setPhoneNumber("");
    setCategory("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await inscribirTorneo(
      {
        torneo_id,
        player_1_full_name: player1Name,
        player_2_full_name: player2Name,
        phone_number: phoneNumber,
        category: category || null,
      },
      categoriesNeeded,
    );

    if (!response.success) {
      toast.error(response.error, { position: "top-center" });
    } else {
      toast.success("Inscripción realizada correctamente", {
        position: "top-center",
      });
      resetForm();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mb-8 items-center md:w-1/2 mx-auto px-4 md:px-0"
    >
      {categories && categories.length > 0 && (
        <div className="grid gap-2 w-full">
          <Label htmlFor="category" className="font-semibold">
            Categoría <span className="text-xs text-red-500">*</span>
          </Label>

          <div className="relative">
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
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

            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full justify-between">
        <div className="grid gap-2 md:w-1/2 bg-primary rounded-lg p-4 shadow-card">
          <Label className="font-bold" htmlFor="player_1_full_name">
            Jugador 1 <span className="text-xs text-red-500">*</span>
          </Label>
          <Input
            id="player_1_full_name"
            name="player_1_full_name"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            type="text"
            placeholder="Nombre y Apellidos"
            required
            className="border-border bg-background/50"
          />
        </div>

        <div className="grid gap-2 md:w-1/2 bg-primary rounded-lg p-4 shadow-card">
          <Label className="font-bold" htmlFor="player_2_full_name">
            Jugador 2 <span className="text-xs text-red-500">*</span>
          </Label>
          <Input
            id="player_2_full_name"
            name="player_2_full_name"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            type="text"
            placeholder="Nombre y Apellidos"
            required
            className="border-border bg-background/50"
          />
        </div>
      </div>

      <div className="grid gap-2 w-full">
        <Label className="font-bold" htmlFor="phone_number">
          Teléfono de Contacto <span className="text-xs text-red-500">*</span>
        </Label>
        <Input
          id="phone_number"
          name="phone_number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          type="tel"
          placeholder="600 00 00 00"
          required
        />
        <p className="text-xs opacity-70">
          Te contactaremos a este número para confirmar detalles.
        </p>
      </div>

      <Button className="w-fit font-bold" type="submit" variant="secondary">
        Confirmar Inscripción
      </Button>
    </form>
  );
}
