"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  icon?: React.ReactNode;
};

export default function DatePicker({
  label,
  value,
  onChange,
  required = false,
  icon,
}: Props) {
  const date = value ? new Date(value) : undefined;

  return (
    <div className="grid gap-2">
      <Label className="flex items-center gap-2 font-bold">
        {icon}
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>

      <Popover>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              data-empty={!date}
              className="justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
            />
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4" />

          {date ? (
            format(date, "dd/MM/yyyy", { locale: es })
          ) : (
            <span>Selecciona una fecha</span>
          )}
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => onChange(d ? format(d, "yyyy-MM-dd") : "")}
            locale={es}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
