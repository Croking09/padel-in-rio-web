"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SeasonRow } from "@/lib/types/season";

const COOKIE_KEY = "seasonId";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 año

function setSeasonCookie(value: string) {
  document.cookie = `${COOKIE_KEY}=${value}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}`;
}

export default function SeasonSelector({
  seasons,
  currentSeasonId,
}: {
  seasons: SeasonRow[];
  currentSeasonId: number;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  if (!seasons || seasons.length === 0) return null;

  const items = seasons.map((t) => ({
    label: `Temporada ${t.name}`,
    value: t.id,
  }));

  const seasonIdFromUrl = searchParams.get("seasonId");
  const activeTemporadaId = seasonIdFromUrl
    ? Number(seasonIdFromUrl)
    : currentSeasonId;

  const handleChange = (seasonId: number | null) => {
    if (seasonId === null) return;

    setSeasonCookie(String(seasonId));

    const params = new URLSearchParams(searchParams);
    params.set("seasonId", String(seasonId));
    params.delete("monthId");
    router.push(`?${params.toString()}`);
  };

  return (
    <Select
      items={items}
      value={activeTemporadaId}
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
