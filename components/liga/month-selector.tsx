"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Month } from "@/lib/types/month";
import { formatMonth } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MonthSelector({
  months,
  currentMonthId,
}: {
  months: Month[];
  currentMonthId?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const items = months.map((m) => ({
    value: String(m.id),
    label: `${formatMonth(m.month)} - ${m.year}`,
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
