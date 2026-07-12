"use server";

import { createAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Match } from "@/lib/types/match";
import MatchParticipants from "@/lib/types/matchParticipants";
import { SetResult } from "@/lib/types/setResult";
import { Socio } from "@/lib/types/socio";
import { cacheLife, cacheTag, updateTag } from "next/cache";

interface PartidoResponse {
  id: number;
  categoria_id: number;
  Categorias: { name: string } | null;
  Participacion: {
    id: number;
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
        Participacion (
          id,
          Player:Socios!participacion_jugador_id_fkey ( id, full_name, nickname )
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
        players: [...(partido.Participacion ?? [])]
          .sort((a, b) => a.id - b.id)
          .map((jp) => jp.Player)
          .filter((s): s is Socio => Boolean(s)),
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
      players:Participacion (
        id,
        jugador:Socios!participacion_jugador_id_fkey (
          id,
          nickname,
          full_name
        )
      )
    `,
    )
    .eq("id", partidoId)
    .single();

  return [...(match?.players ?? [])]
    .sort((a, b) => a.id - b.id)
    .map((p) => p.jugador as unknown as Omit<Socio, "active">);
}

export async function registerMatchResults(
  partidoId: number,
  sets: SetResult[],
  participacion: MatchParticipants[],
) {
  const supabase = createAdmin();

  const { error } = await supabase.rpc("register_match_results", {
    p_partido_id: partidoId,
    p_sets: sets,
    p_participacion: participacion,
  });

  if (error) return { success: false, error };

  updateTag("results");
  updateTag("existsResult");
  updateTag("participation");

  return { success: true };
}

export interface SetWithPlayers {
  orden: number;
  pareja1: [Socio, Socio];
  pareja2: [Socio, Socio];
  pareja1_juegos: number;
  pareja2_juegos: number;
}

interface SetRowFromDB {
  orden: number;
  pareja1_juegos: number;
  pareja2_juegos: number;
  jugador1: { id: number; full_name: string; nickname: string | null };
  jugador2: { id: number; full_name: string; nickname: string | null };
  jugador3: { id: number; full_name: string; nickname: string | null };
  jugador4: { id: number; full_name: string; nickname: string | null };
}

export async function getMatchResults(
  partidoId: number,
): Promise<SetWithPlayers[]> {
  "use cache";
  cacheLife("days");
  cacheTag("results");

  const supabase = await createClient({ useCookies: false });

  const { data, error } = await supabase
    .from("Sets")
    .select(
      `
      orden,
      pareja1_juegos,
      pareja2_juegos,
      jugador1:pareja1_jugador1_id(id, full_name, nickname),
      jugador2:pareja1_jugador2_id(id, full_name, nickname),
      jugador3:pareja2_jugador1_id(id, full_name, nickname),
      jugador4:pareja2_jugador2_id(id, full_name, nickname)
    `,
    )
    .eq("partido_id", partidoId)
    .order("orden");

  if (error) console.error(error);

  const rows = data as unknown as SetRowFromDB[];

  return rows.map(
    (row): SetWithPlayers => ({
      orden: row.orden,
      pareja1: [
        { ...row.jugador1, active: true },
        { ...row.jugador2, active: true },
      ],
      pareja2: [
        { ...row.jugador3, active: true },
        { ...row.jugador4, active: true },
      ],
      pareja1_juegos: row.pareja1_juegos,
      pareja2_juegos: row.pareja2_juegos,
    }),
  );
}

export async function getMatchParticipation(partidoId: number) {
  "use cache";
  cacheLife("days");
  cacheTag("participation");

  const supabase = await createClient({ useCookies: false });

  const { data, error } = await supabase
    .from("Participacion")
    .select("jugador_id, sustituto_id")
    .eq("partido_id", partidoId);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function existsResult(matchId: number) {
  "use cache";
  cacheLife("days");
  cacheTag("existsResult");

  const supabase = await createClient({ useCookies: false });

  const { data, error } = await supabase
    .from("Sets")
    .select("id")
    .eq("partido_id", matchId);

  if (error) {
    console.error(error);
    return false;
  }

  return data.length > 0;
}

/**
 * Versión batch de `existsResult`: en vez de hacer una query por partido
 * (N+1), hace una única query con `.in(...)` y devuelve los IDs que ya
 * tienen algún set registrado.
 *
 * Comparte tag ("existsResult") con `existsResult` porque ambas dependen
 * de la misma tabla y se invalidan siempre juntas.
 *
 * Reemplaza el patrón `Promise.all(matches.map(m => existsResult(m.id)))`
 * que se usaba en la página de partidos.
 */
export async function existResultsBatch(matchIds: number[]): Promise<number[]> {
  "use cache";
  cacheLife("days");
  cacheTag("existsResult");

  if (matchIds.length === 0) return [];

  const supabase = await createClient({ useCookies: false });

  const { data, error } = await supabase
    .from("Sets")
    .select("partido_id")
    .in("partido_id", matchIds);

  if (error) {
    console.error(error);
    return [];
  }

  return data.map((row) => row.partido_id as number);
}
