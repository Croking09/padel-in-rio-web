"use server";

import { createAdmin } from "@/lib/supabase/admin";
import { generateCategoryMatches, Match } from "@/lib/utils";
import { revalidatePath } from "next/cache";

interface Socio {
  id: number;
  full_name: string;
  nickname: string | null;
}

interface JugadorCategoriaMes {
  jugador_id: number;
  Socios: Socio | Socio[];
}

export async function previewMonth(mesId: number) {
  const supabase = createAdmin();

  const { data: categories } = await supabase
    .from("Categorias")
    .select("id,name");

  const result = [];

  for (const cat of categories!) {
    const { data } = await supabase
      .from("Jugador_Categoria_Mes")
      .select("jugador_id, Socios(id, full_name, nickname)")
      .eq("mes_id", mesId)
      .eq("categoria_id", cat.id);

    if (!data || data.length !== 8) {
      throw new Error(`Categoria ${cat.name} inválida`);
    }

    const players = data.map((p: JugadorCategoriaMes) => {
      const socio = Array.isArray(p.Socios) ? p.Socios[0] : p.Socios;
      return {
        id: socio.id,
        full_name: socio.full_name,
        nickname: socio.nickname,
      };
    });

    result.push(...generateCategoryMatches(cat.id, cat.name, players));
  }

  return result;
}

export async function confirmMonth(monthId: number, matches: Match[]) {
  const supabase = createAdmin();

  const matchesPayload = matches.map((m) => ({
    categoryId: m.categoryId,
    matchday: m.matchday,
    players: m.players.map((p) => p.id),
  }));

  const { error } = await supabase.rpc("generar_partidos_mes", {
    p_mes_id: monthId,
    p_partidos: matchesPayload,
  });

  if (error) {
    console.log(error);
    return { success: false, error };
  }

  revalidatePath("/admin/liga/generador");
  return { success: true };
}
