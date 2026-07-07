"use client";

import { Temporada } from "@/lib/types/temporada";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COOKIE_KEY = "temporadaId";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 año

function setTemporadaCookie(value: string) {
  document.cookie = `${COOKIE_KEY}=${value}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}`;
}

export default function TemporadaSelector({
  temporadas,
  currentTemporadaId,
}: {
  temporadas: Temporada[];
  currentTemporadaId: number;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  if (!temporadas || temporadas.length === 0) return null;

  const items = temporadas.map((t) => ({
    label: `Temporada ${t.name}`,
    value: t.id,
  }));

  const temporadaIdFromUrl = searchParams.get("temporadaId");
  const activeTemporadaId = temporadaIdFromUrl
    ? Number(temporadaIdFromUrl)
    : currentTemporadaId;

  const handleChange = (temporadaId: number | null) => {
    if (temporadaId === null) return;

    setTemporadaCookie(String(temporadaId));

    const params = new URLSearchParams(searchParams);
    params.set("temporadaId", String(temporadaId));
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
          {temporadas.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              Temporada {t.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
