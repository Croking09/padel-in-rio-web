"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SeasonRow } from "@/lib/types/season";
import { setActiveSeasonId } from "@/app/actions/season-actions";

export default function SeasonSelector({
  seasons,
  currentSeasonId,
}: {
  seasons: SeasonRow[];
  currentSeasonId: number;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();

  if (!seasons || seasons.length === 0) return null;

  const seasonIdFromUrl = searchParams.get("seasonId");
  const activeSeasonId = seasonIdFromUrl
    ? Number(seasonIdFromUrl)
    : currentSeasonId;

  const handleChange = (seasonId: number | null) => {
    if (seasonId === null) return;

    const params = new URLSearchParams(searchParams);
    params.set("seasonId", String(seasonId));
    params.delete("monthId");

    startTransition(async () => {
      await setActiveSeasonId(seasonId);
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <Select
      items={seasons.map((t) => ({
        label: `Temporada ${t.name}`,
        value: t.id,
      }))}
      value={activeSeasonId}
      onValueChange={handleChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecciona una temporada" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectGroup>
          {seasons.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              Temporada {t.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
