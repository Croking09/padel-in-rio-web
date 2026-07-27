"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { createSeason } from "@/app/actions/season-actions";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function getNext12Months(startDate?: Date): { month: number; year: number }[] {
  if (!startDate) return [];

  const month = startDate.getMonth() + 1;
  const year = startDate.getFullYear();

  const result = [];
  for (let i = 0; i < 12; i++) {
    const m = ((month - 1 + i) % 12) + 1;
    const y = year + Math.floor((month - 1 + i) / 12);
    result.push({ month: m, year: y });
  }
  return result;
}

export default function CreateSeasonButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [selectedMonths, setSelectedMonths] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const availableMonths = useMemo(
    () => getNext12Months(startDate),
    [startDate],
  );

  const monthKey = (m: { month: number; year: number }) =>
    `${m.year}-${m.month}`;

  const toggleMonth = (m: { month: number; year: number }) => {
    setSelectedMonths((prev) => {
      const next = new Set(prev);
      const key = monthKey(m);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setStartDate(undefined);
    setSelectedMonths(new Set());
  };

  const handleStartDateChange = (value?: Date) => {
    setStartDate(value);
    setSelectedMonths(new Set());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate) return;

    setLoading(true);

    const months = availableMonths.filter((m) =>
      selectedMonths.has(monthKey(m)),
    );

    const result = await createSeason({
      name,
      start_date: format(startDate, "yyyy-MM-dd"),
      months,
    });

    setLoading(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Temporada creada correctamente");
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => (v ? setOpen(true) : handleClose())}
    >
      <DialogTrigger
        render={
          <Button className="w-fit">
            <PlusIcon />
            Nueva temporada
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Crear temporada
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <Label className="text-xs">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Temporada 2027"
              required
            />
          </div>

          <DatePicker
            label="Fecha de inicio"
            value={startDate}
            onChange={handleStartDateChange}
            required
          />

          {availableMonths.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Meses</Label>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg border border-border p-4">
                {availableMonths.map((m) => {
                  const key = monthKey(m);
                  return (
                    <label
                      key={key}
                      className="flex items-center gap-2 cursor-pointer select-none"
                    >
                      <Checkbox
                        checked={selectedMonths.has(key)}
                        onCheckedChange={() => toggleMonth(m)}
                      />
                      <span>
                        {format(new Date(2000, m.month - 1), "LLLL", {
                          locale: es,
                        })}{" "}
                        <span className="text-muted-foreground">{m.year}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>

            <Button type="submit" disabled={loading || !startDate}>
              {loading ? "Creando..." : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
