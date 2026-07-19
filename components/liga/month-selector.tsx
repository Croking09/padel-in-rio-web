"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MonthRow } from "@/lib/types/month";

export default function MonthSelector({
  months,
  currentMonthId,
}: {
  months: MonthRow[];
  currentMonthId?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const items = months.map((m) => ({
    value: String(m.id),
    label: `${format(new Date(2000, m.month - 1), "LLLL", { locale: es })} - ${m.year}`,
  }));

  const handleChange = (value: string | null) => {
    if (!value) return;

    const params = new URLSearchParams(searchParams);
    params.set("monthId", value);

    router.push(`?${params.toString()}`);
  };

  return (
    <Select
      items={items}
      value={currentMonthId ? String(currentMonthId) : null}
      onValueChange={handleChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecciona un mes" />
      </SelectTrigger>

      <SelectContent alignItemWithTrigger={false}>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
