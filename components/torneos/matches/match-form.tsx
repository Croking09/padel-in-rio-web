"use client";

import { useState, useTransition } from "react";
import { endOfDay, isAfter, isBefore, startOfDay } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
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
import { TournamentMatchRow } from "@/lib/types/tournament-match";

export type MatchFormData = {
  category: string | null;
  pair1: string[];
  pair2: string[];
  scheduled_datetime: string;
};

type MatchFormProps = {
  tournament: TournamentRow;
  initialValues?: TournamentMatchRow;
  submitLabel: string;
  onSubmit: (data: MatchFormData) => Promise<{
    success: boolean;
    error?: string;
  }>;
  onSuccess?: () => void;
};

export default function MatchForm({
  tournament,
  initialValues,
  submitLabel,
  onSubmit,
  onSuccess,
}: MatchFormProps) {
  const [pair1, setPair1] = useState(initialValues?.pair1 ?? ["", ""]);

  const [pair2, setPair2] = useState(initialValues?.pair2 ?? ["", ""]);

  const [scheduledTime, setScheduledTime] = useState<Date | undefined>(
    initialValues ? new Date(initialValues.scheduled_datetime) : undefined,
  );

  const [category, setCategory] = useState<string | null>(
    initialValues?.category ?? null,
  );

  const [isPending, startTransition] = useTransition();

  const [errors, setErrors] = useState({
    pair1: false,
    pair2: false,
    scheduledTime: null as string | null,
    category: false,
  });

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
        pair1: pair1.some((p) => !p.trim()),
        pair2: pair2.some((p) => !p.trim()),
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

      const result = await onSubmit({
        category,
        pair1,
        pair2,
        scheduled_datetime: scheduledTime!.toISOString(),
      });

      if (!result.success) {
        toast.error(result.error ?? "Ha ocurrido un error");
        return;
      }

      toast.success("Partido guardado con éxito");
      onSuccess?.();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FieldGroup>
        <Field data-invalid={errors.pair1}>
          <FieldLabel>
            Pareja 1<span className="text-destructive">*</span>
          </FieldLabel>

          <div className="flex flex-col gap-2 md:flex-row">
            <Input
              placeholder="Jugador 1"
              value={pair1[0]}
              onChange={(e) => {
                setPair1([e.target.value, pair1[1]]);
                clearError("pair1");
              }}
            />

            <Input
              placeholder="Jugador 2"
              value={pair1[1]}
              onChange={(e) => {
                setPair1([pair1[0], e.target.value]);
                clearError("pair1");
              }}
            />
          </div>

          {errors.pair1 && (
            <FieldError>Introduce los dos jugadores de la pareja.</FieldError>
          )}
        </Field>

        <Field data-invalid={errors.pair2}>
          <FieldLabel>
            Pareja 2<span className="text-destructive">*</span>
          </FieldLabel>

          <div className="flex flex-col gap-2 md:flex-row">
            <Input
              placeholder="Jugador 1"
              value={pair2[0]}
              onChange={(e) => {
                setPair2([e.target.value, pair2[1]]);
                clearError("pair2");
              }}
            />

            <Input
              placeholder="Jugador 2"
              value={pair2[1]}
              onChange={(e) => {
                setPair2([pair2[0], e.target.value]);
                clearError("pair2");
              }}
            />
          </div>

          {errors.pair2 && (
            <FieldError>Introduce los dos jugadores de la pareja.</FieldError>
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

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
