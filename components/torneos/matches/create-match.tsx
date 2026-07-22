"use client";

import { createMatch } from "@/app/actions/tournament-match-actions";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldSeparator,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateMatch({
  tournamentId,
  categories,
}: {
  tournamentId: number;
  categories: string[] | null;
}) {
  const [open, setOpen] = useState(false);

  const [pair1Player1, setPair1Player1] = useState("");
  const [pair1Player2, setPair1Player2] = useState("");
  const [pair2Player1, setPair2Player1] = useState("");
  const [pair2Player2, setPair2Player2] = useState("");

  const [scheduledTime, setScheduledTime] = useState<Date>();
  const [category, setCategory] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    pair1: false,
    pair2: false,
    scheduledTime: false,
    category: false,
  });

  const resetForm = () => {
    setPair1Player1("");
    setPair1Player2("");
    setPair2Player1("");
    setPair2Player2("");

    setScheduledTime(undefined);
    setCategory(null);

    setErrors({
      pair1: false,
      pair2: false,
      scheduledTime: false,
      category: false,
    });
  };

  const clearError = (field: keyof typeof errors) => {
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      pair1: !pair1Player1 || !pair1Player2,
      pair2: !pair2Player1 || !pair2Player2,
      scheduledTime: !scheduledTime,
      category: categories ? !category : false,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    // console.log({
    //   tournamentId,
    //   pair1: [pair1Player1, pair1Player2],
    //   pair2: [pair2Player1, pair2Player2],
    //   scheduledTime,
    //   category,
    // });
    const result = await createMatch({
      category,
      pair1: [pair1Player1, pair1Player2],
      pair2: [pair2Player1, pair2Player2],
      scheduled_datetime: scheduledTime!.toISOString(),
      tournament_id: tournamentId,
    });

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Partido creado con éxito");
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value) {
          resetForm();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <PlusIcon />
            Crear partido
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Nuevo partido
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={errors.pair1}>
              <FieldLabel>
                Pareja 1<span className="text-destructive">*</span>
              </FieldLabel>

              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  placeholder="Jugador 1"
                  value={pair1Player1}
                  onChange={(e) => {
                    setPair1Player1(e.target.value);
                    clearError("pair1");
                  }}
                />

                <Input
                  placeholder="Jugador 2"
                  value={pair1Player2}
                  onChange={(e) => {
                    setPair1Player2(e.target.value);
                    clearError("pair1");
                  }}
                />
              </div>

              {errors.pair1 && (
                <FieldError>
                  Introduce los dos jugadores de la pareja.
                </FieldError>
              )}
            </Field>

            <Field data-invalid={errors.pair2}>
              <FieldLabel>
                Pareja 2<span className="text-destructive">*</span>
              </FieldLabel>

              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  placeholder="Jugador 1"
                  value={pair2Player1}
                  onChange={(e) => {
                    setPair2Player1(e.target.value);
                    clearError("pair2");
                  }}
                />

                <Input
                  placeholder="Jugador 2"
                  value={pair2Player2}
                  onChange={(e) => {
                    setPair2Player2(e.target.value);
                    clearError("pair2");
                  }}
                />
              </div>

              {errors.pair2 && (
                <FieldError>
                  Introduce los dos jugadores de la pareja.
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          <FieldSeparator />

          <FieldGroup>
            <Field data-invalid={errors.scheduledTime}>
              <DatePicker
                label="Fecha y hora"
                value={scheduledTime}
                onChange={(value) => {
                  setScheduledTime(value);
                  clearError("scheduledTime");
                }}
                required
                withTime
              />

              {errors.scheduledTime && (
                <FieldError>Selecciona la fecha y hora del partido.</FieldError>
              )}
            </Field>

            {categories && (
              <Field data-invalid={errors.category}>
                <FieldLabel htmlFor="category">
                  Categoría<span className="text-destructive">*</span>
                </FieldLabel>

                <Select
                  value={category ?? ""}
                  onValueChange={(value) => {
                    setCategory(value);
                    clearError("category");
                  }}
                >
                  <SelectTrigger id="category">
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

                {errors.category && (
                  <FieldError>Selecciona una categoría.</FieldError>
                )}
              </Field>
            )}
          </FieldGroup>

          <DialogFooter>
            <DialogClose
              render={<Button variant="secondary">Cancelar</Button>}
            />

            <Button type="submit">Crear</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
