"use server";

import { createAdmin } from "@/lib/supabase/admin";
import { generateCategoryMatches } from "@/lib/utils";
import { Match } from "@/lib/types/match";
import { updateTag } from "next/cache";
import { Socio } from "@/lib/types/socio";

interface JugadorCategoriaMes {
  jugador_id: number;
  Socios: Socio | Socio[];
}

export async function previewMonth(mesId: number) {
  const supabase = createAdmin();

  // 1. Obtener configuración del mes
  const { data: month, error: monthError } = await supabase
    .from("Meses")
    .select("5_category")
    .eq("id", mesId)
    .single();

  if (monthError) throw monthError;

  const showFifthCategory = month?.["5_category"] ?? false;

  // 2. Obtener categorías
  const { data: categories, error: catError } = await supabase
    .from("Categorias")
    .select("id,name");

  if (catError) throw catError;

  // 3. Filtrar categorías según configuración del mes
  const filteredCategories = (categories ?? []).filter((cat) => {
    if (showFifthCategory) return true;
    return cat.name !== "5ª";
  });

  const result = [];

  // 4. Generar partidos por categoría
  for (const cat of filteredCategories) {
    const { data, error } = await supabase
      .from("Jugador_Categoria_Mes")
      .select("jugador_id, Socios(id, full_name, nickname, active)")
      .eq("mes_id", mesId)
      .eq("categoria_id", cat.id);

    if (error) throw error;

    const players = (data ?? []).map((p: JugadorCategoriaMes) => {
      const socio = Array.isArray(p.Socios) ? p.Socios[0] : p.Socios;

      return {
        id: socio.id,
        full_name: socio.full_name,
        nickname: socio.nickname,
        active: socio.active,
      };
    });

    const matches = generateCategoryMatches(cat.id, cat.name, players);

    result.push(...matches);
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

  updateTag("participation");
  return { success: true };
}
