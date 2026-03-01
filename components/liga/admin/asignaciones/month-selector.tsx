"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Month } from "@/app/actions/monthly-assignment";
import { formatMonth } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export default function MonthSelector({
  months,
  currentMonthId,
}: {
  months: Month[];
  currentMonthId: number | undefined;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("monthId", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Label className="font-medium text-sm">Mes:</Label>
      <select
        value={currentMonthId}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-background border rounded px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2"
      >
        {months.map((m) => (
          <option key={m.id} value={m.id}>
            {formatMonth(m.month)} -{" "}
            {m.temporada_name || `Temp ${m.temporada_id}`}
          </option>
        ))}
      </select>
    </div>
  );
}
