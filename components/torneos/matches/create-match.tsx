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
import { TournamentRow } from "@/lib/types/tournament";
import { endOfDay, isAfter, isBefore, startOfDay } from "date-fns";
import { PlusIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function CreateMatch({
  tournament,
}: {
  tournament: TournamentRow;
}) {
  const [open, setOpen] = useState(false);

  const [pair1Player1, setPair1Player1] = useState("");
  const [pair1Player2, setPair1Player2] = useState("");
  const [pair2Player1, setPair2Player1] = useState("");
  const [pair2Player2, setPair2Player2] = useState("");

  const [scheduledTime, setScheduledTime] = useState<Date>();
  const [category, setCategory] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const [errors, setErrors] = useState({
    pair1: false,
    pair2: false,
    scheduledTime: null as string | null,
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
      scheduledTime: null,
      category: false,
    });
  };

  const clearError = (field: keyof typeof errors) => {
    setErrors((prev) => ({
      ...prev,
      [field]: field === "scheduledTime" ? null : false,
    }));
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      const startDate = startOfDay(new Date(tournament.start_date));
      const endDate = endOfDay(new Date(tournament.end_date));

      let scheduledTimeError: string | null = null;

      if (!scheduledTime) {
        scheduledTimeError = "Selecciona la fecha y hora del partido.";
      } else if (
        isBefore(scheduledTime, startDate) ||
        isAfter(scheduledTime, endDate)
      ) {
        scheduledTimeError =
          "La fecha y hora debe estar dentro de las fechas del torneo.";
      }

      const newErrors = {
        pair1: !pair1Player1 || !pair1Player2,
        pair2: !pair2Player1 || !pair2Player2,
        scheduledTime: scheduledTimeError,
        category: tournament.categories ? !category : false,
      };

      setErrors(newErrors);

      if (
        newErrors.pair1 ||
        newErrors.pair2 ||
        newErrors.scheduledTime ||
        newErrors.category
      ) {
        return;
      }

      const result = await createMatch({
        category,
        pair1: [pair1Player1, pair1Player2],
        pair2: [pair2Player1, pair2Player2],
        scheduled_datetime: scheduledTime!.toISOString(),
        tournament_id: tournament.id,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Partido creado con éxito");
      resetForm();
      setOpen(false);
    });
  }

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
            <Field data-invalid={!!errors.scheduledTime}>
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
                <FieldError>{errors.scheduledTime}</FieldError>
              )}
            </Field>

            {tournament.categories && (
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
                      {tournament.categories.map((category) => (
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

            <Button type="submit" disabled={isPending}>
              {isPending ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
