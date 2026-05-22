"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { getParticipationHistoric } from "@/app/actions/socios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMonth as formatMonthName } from "@/lib/utils";
import type { Month } from "@/lib/types/month";
import type { MonthParticipation } from "@/lib/types/monthParticipation";
import type { Socio } from "@/lib/types/socio";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatHistoricMonth(month?: Month) {
  if (!month) return "Mes no encontrado";

  return `${formatMonthName(month.month)} ${month.year}`;
}

type Props = {
  socios: Socio[];
  months: Month[];
};

export default function HistoricoClient({ socios, months }: Props) {
  const [search, setSearch] = useState("");
  const [participation, setParticipation] = useState<MonthParticipation[]>([]);
  const [isPending, startTransition] = useTransition();

  const normalizedSearch = normalize(search);

  const suggestions = useMemo(() => {
    if (!normalizedSearch) return [];

    return socios
      .filter((socio) => {
        const fullName = normalize(socio.full_name);
        const nickname = normalize(socio.nickname ?? "");

        return (
          fullName.includes(normalizedSearch) ||
          nickname.includes(normalizedSearch)
        );
      })
      .slice(0, 6);
  }, [normalizedSearch, socios]);

  const selectedSocio = useMemo(() => {
    if (!normalizedSearch) return undefined;

    return socios.find((socio) => {
      const fullName = normalize(socio.full_name);
      const nickname = normalize(socio.nickname ?? "");

      return fullName === normalizedSearch || nickname === normalizedSearch;
    });
  }, [normalizedSearch, socios]);

  const monthById = useMemo(() => {
    return new Map(months.map((month) => [month.id, month]));
  }, [months]);

  const historic = useMemo(() => {
    return [...participation].sort((a, b) => {
      const monthA = monthById.get(a.monthId);
      const monthB = monthById.get(b.monthId);

      if (!monthA || !monthB) return a.monthId - b.monthId;
      if (monthA.year !== monthB.year) return monthA.year - monthB.year;
      return monthA.month - monthB.month;
    });
  }, [monthById, participation]);

  useEffect(() => {
    if (!selectedSocio) {
      setParticipation([]);
      return;
    }

    startTransition(async () => {
      const data = await getParticipationHistoric(selectedSocio.id);
      setParticipation(data);
    });
  }, [selectedSocio]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="relative">
        <div className="flex w-full">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar socio..."
            className="h-10 rounded-tr-none rounded-br-none"
          />
          <Button
            type="button"
            variant="secondary"
            className="h-10 rounded-tl-none rounded-bl-none"
            aria-label="Buscar socio"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {normalizedSearch && !selectedSocio && suggestions.length > 0 && (
          <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-md border bg-card shadow">
            {suggestions.map((socio) => (
              <button
                key={socio.id}
                type="button"
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-primary/20"
                onClick={() => setSearch(socio.full_name)}
              >
                <span className="font-medium">{socio.full_name}</span>
                {socio.nickname && (
                  <span className="text-xs text-muted-foreground">
                    {socio.nickname}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedSocio && (
        <div className="rounded-xl border border-border">
          <div className="flex items-center justify-between gap-3 border-b border-border bg-primary/40 px-4 py-3">
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold">
                {selectedSocio.full_name}
              </h1>
              {selectedSocio.nickname && (
                <p className="text-sm text-muted-foreground">
                  {selectedSocio.nickname}
                </p>
              )}
            </div>
            <Badge variant="secondary">{historic.length} meses</Badge>
          </div>

          {isPending ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              Cargando historico...
            </div>
          ) : historic.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              No hay participacion registrada para este socio.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase">
                    Mes
                  </th>
                  <th className="w-32 px-4 py-2 text-center text-xs font-semibold uppercase">
                    Categoria
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {historic.map((item, index) => (
                  <tr
                    key={item.id}
                    className={index % 2 === 0 ? "bg-primary/10" : undefined}
                  >
                    <td className="px-4 py-3">
                      {formatHistoricMonth(monthById.get(item.monthId))}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="outline">
                        Categoria {item.categoryId}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
