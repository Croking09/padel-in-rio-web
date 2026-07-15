"use server";

import { createAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { Match } from "@/lib/types/match";
import MatchParticipants from "@/lib/types/matchParticipants";
import { SetResult } from "@/lib/types/setResult";
import { Socio } from "@/lib/types/socio";
import { cacheLife, cacheTag, updateTag } from "next/cache";

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
