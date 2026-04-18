"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Month } from "@/app/actions/monthly-assignment";
import { formatMonth } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWebHaptics } from "web-haptics/react";
import { hapticResponseSettings } from "@/lib/haptic";

export default function MonthSelector({
  months,
  currentMonthId,
}: {
  months: Month[];
  currentMonthId: number | undefined;
}) {
  const { trigger } = useWebHaptics();

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("monthId", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Select
        value={currentMonthId ? String(currentMonthId) : ""}
        onValueChange={(value) => {
          trigger(hapticResponseSettings);
          handleChange(value);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" className="bg-background">
          <SelectGroup>
            {months.map((m) => (
              <SelectItem
                key={m.id}
                value={String(m.id)}
                className="hover:bg-primary py-1 px-4"
              >
                {formatMonth(m.month) + " - " + m.year}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
