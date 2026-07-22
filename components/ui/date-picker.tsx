"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  label: string;
  value?: Date;
  onChange: (value?: Date) => void;
  required?: boolean;
  icon?: React.ReactNode;
  withTime?: boolean;
};

export default function DatePicker({
  label,
  value,
  onChange,
  required = false,
  icon,
  withTime = false,
}: Props) {
  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) {
      onChange(undefined);
      return;
    }

    const newDate = new Date(selected);

    if (value) {
      newDate.setHours(
        value.getHours(),
        value.getMinutes(),
        value.getSeconds(),
        0,
      );
    } else {
      newDate.setHours(0, 0, 0, 0);
    }

    onChange(newDate);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = event.target.value;

    if (!time) {
      onChange(undefined);
      return;
    }

    const [hours, minutes] = time.split(":");

    const newDate = value ? new Date(value) : new Date();

    newDate.setHours(Number(hours), Number(minutes), 0, 0);

    if (isNaN(newDate.getTime())) {
      return;
    }

    onChange(newDate);
  };

  return (
    <div className="grid gap-2">
      <Label className="flex items-center gap-2 font-bold">
        {icon}
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>

      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger
            render={
              <Button
                type="button"
                variant="outline"
                data-empty={!value}
                className="flex-1 justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
              />
            }
          >
            <CalendarIcon className="mr-2 h-4 w-4" />

            {value ? (
              format(value, "dd/MM/yyyy", { locale: es })
            ) : (
              <span>Selecciona una fecha</span>
            )}
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              locale={es}
            />
          </PopoverContent>
        </Popover>

        {withTime && (
          <Input
            type="time"
            step="60"
            className="w-fit appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            value={value ? format(value, "HH:mm") : ""}
            onChange={handleTimeChange}
          />
        )}
      </div>
    </div>
  );
}
