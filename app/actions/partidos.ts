"use server";

import { createAdmin } from "@/lib/supabase/admin";
import { Match } from "@/lib/types/match";
import { SetResult } from "@/lib/types/setResult";
import { Socio } from "@/lib/types/socio";

interface PartidoResponse {
  id: number;
  categoria_id: number;
  Categorias: { name: string } | null;
  Jugador_Partido: {
    Player: Socio | null;
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
        id: partido.id,
        categoryId: partido.categoria_id,
        categoryName: partido.Categorias?.name || "Sin Categoría",
        matchday: jornada.number,
        players:
          partido.Jugador_Partido?.map((jp) => jp.Player).filter(
            (s): s is Socio => Boolean(s),
          ) || [],
      });
    });
  });

  return matches;
}

export async function getPlayersByPartido(partidoId: number) {
  const supabase = createAdmin();

  const { data: match } = await supabase
    .from("Partidos")
    .select(
      `
      id,
      players:Jugador_Partido (
        jugador:Socios (
          id,
          nickname,
          full_name
        )
      )
    `,
    )
    .eq("id", partidoId)
    .single();

  return (
    match?.players?.map((p) => p.jugador as unknown as Omit<Socio, "active">) ??
    []
  );
}

export async function registerMatchResults(
  partidoId: number,
  sets: SetResult[],
) {
  const supabase = createAdmin();

  const { error } = await supabase.rpc("register_match_results", {
    p_partido_id: partidoId,
    p_sets: sets,
  });

  if (error) return { success: false, error };

  return { success: true };
}
