"use server";

import { createAdmin } from "@/lib/supabase/admin";
import { Match } from "@/lib/utils";
import type { Player } from "@/app/actions/monthly-assignment";

interface PartidoResponse {
  id: number;
  categoria_id: number;
  Categorias: { name: string } | null;
  Jugador_Partido: {
    Player: Player | null;
  }[];
}

interface JornadaResponse {
  number: number;
  Partidos: PartidoResponse[];
}

export async function getConfirmedMatches(monthId: number): Promise<Match[]> {
  const supabase = createAdmin();

  const { data, error } = await supabase
    .from("Jornadas")
    .select(
      `
      number,
      Partidos (
        id,
        categoria_id,
        Categorias ( name ),
        Jugador_Partido (
          Player:Socios ( id, full_name, nickname )
        )
      )
    `,
    )
    .eq("mes_id", monthId)
    .order("number");

  if (error) {
    console.error("Error fetching confirmed matches:", error);
    return [];
  }

  const matches: Match[] = [];

  (data as unknown as JornadaResponse[])?.forEach((jornada) => {
    jornada.Partidos?.forEach((partido) => {
      matches.push({
        categoryId: partido.categoria_id,
        categoryName: partido.Categorias?.name || "Sin Categoría",
        matchday: jornada.number,
        players:
          partido.Jugador_Partido?.map((jp) => jp.Player).filter(
            (s): s is Player => Boolean(s),
          ) || [],
      });
    });
  });

  return matches;
}
