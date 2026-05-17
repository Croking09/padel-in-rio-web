"use client";

import { TemporadaWithMonths } from "@/lib/types/temporada";
import TemporadaCard from "./temporada-card";

export default function TemporadasClient({
  temporadas,
}: {
  temporadas: TemporadaWithMonths[];
}) {
  return (
    <div className="mx-auto w-full">
      <div className="grid grid-cols-1 gap-8">
        {temporadas.length > 0 ? (
          temporadas.map((temporada) => (
            <TemporadaCard key={temporada.id} temporada={temporada} />
          ))
        ) : (
          <div className="text-sm text-center py-8 text-text-primary">
            No se encontraron temporadas
          </div>
        )}
      </div>
    </div>
  );
}
