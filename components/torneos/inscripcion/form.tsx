"use client";

import { useState } from "react";
import { inscribirTorneo } from "@/app/actions/inscripciones";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { redirect } from "next/navigation";

import { Card } from "@/components/ui/card";

export default function Form({
  torneoId,
  categories,
}: {
  torneoId: number;
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
        torneo_id: torneoId,
        player_1_full_name: player1Name,
        player_2_full_name: player2Name,
        phone_number: phoneNumber,
        category: category || null,
      },
      categoriesNeeded,
    );

    if (!response.success) {
      toast.error(response.error);
    } else {
      toast.success("Inscripción realizada correctamente");
      resetForm();
      redirect("/torneos");
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
            Categoría <span className="text-destructive">*</span>
          </Label>

          <Select
            value={category}
            onValueChange={(value) => setCategory(value ?? "")}
          >
            <SelectTrigger className="w-full" id="category">
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full justify-between">
        <Card className="grid gap-2 md:w-1/2 p-4">
          <Label className="font-bold" htmlFor="player_1_full_name">
            Jugador 1 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="player_1_full_name"
            name="player_1_full_name"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            type="text"
            placeholder="Nombre y Apellidos"
            required
          />
        </Card>

        <Card className="grid gap-2 md:w-1/2 p-4">
          <Label className="font-bold" htmlFor="player_2_full_name">
            Jugador 2 <span className="text-destructive">*</span>
          </Label>
          <Input
            id="player_2_full_name"
            name="player_2_full_name"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            type="text"
            placeholder="Nombre y Apellidos"
            required
          />
        </Card>
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
        <p className="text-xs text-muted-foreground">
          Te contactaremos a este número para confirmar detalles.
        </p>
      </div>

      <Button className="w-fit" type="submit">
        Confirmar Inscripción
      </Button>
    </form>
  );
}
