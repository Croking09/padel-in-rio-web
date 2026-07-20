"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerToTournament } from "@/app/actions/inscription-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";

export default function InscriptionForm({
  tournamentId,
  categories,
}: {
  tournamentId: number;
  categories: string[] | null;
}) {
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const categoriesNeeded = Boolean(categories && categories.length > 0);

  const resetForm = () => {
    setPlayer1Name("");
    setPlayer2Name("");
    setPhoneNumber("");
    setCategory("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (categoriesNeeded && !category) {
      toast.error("Selecciona una categoría.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerToTournament(
        {
          tournament_id: tournamentId,
          player1_full_name: player1Name,
          player2_full_name: player2Name,
          phone_number: phoneNumber,
          category: category || null,
        },
        categoriesNeeded,
      );

      if (!response.success) {
        toast.error(response.error);
        return;
      }

      toast.success("Inscripción realizada correctamente");
      resetForm();
      router.push("/torneos");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mb-8 items-center md:w-1/2 mx-auto px-4 md:px-0"
    >
      <FieldGroup className="w-full">
        {categoriesNeeded && (
          <Field>
            <FieldLabel htmlFor="category">
              Categoría <span className="text-destructive">*</span>
            </FieldLabel>

            <Select
              value={category}
              onValueChange={(value) => setCategory(value ?? "")}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full" id="category">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories!.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}

        <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full justify-between">
          <Card className="p-4 md:w-1/2">
            <Field>
              <FieldLabel htmlFor="player_1_full_name">
                Jugador 1 <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="player_1_full_name"
                name="player_1_full_name"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                type="text"
                placeholder="Nombre y Apellidos"
                required
                disabled={isSubmitting}
              />
            </Field>
          </Card>

          <Card className="p-4 md:w-1/2">
            <Field>
              <FieldLabel htmlFor="player_2_full_name">
                Jugador 2 <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="player_2_full_name"
                name="player_2_full_name"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                type="text"
                placeholder="Nombre y Apellidos"
                required
                disabled={isSubmitting}
              />
            </Field>
          </Card>
        </div>

        <Field>
          <FieldLabel htmlFor="phone_number">
            Teléfono de Contacto <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id="phone_number"
            name="phone_number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            type="tel"
            placeholder="600 00 00 00"
            required
            disabled={isSubmitting}
          />
          <FieldDescription>
            Te contactaremos a este número para confirmar detalles.
          </FieldDescription>
        </Field>

        <Button className="w-fit mx-auto" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Confirmar Inscripción"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
