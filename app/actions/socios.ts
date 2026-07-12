"use server";
import { createAdmin } from "@/lib/supabase/admin";
import type { MonthParticipation } from "@/lib/types/monthParticipation";
import { Socio } from "@/lib/types/socio";
import { cacheLife, cacheTag, updateTag } from "next/cache";

export async function getActiveSociosCount() {
  "use cache";
  cacheLife("days");
  cacheTag("socios-count");

  const supabase = createAdmin();
  const { count } = await supabase
    .from("Socios")
    .select("*", { count: "exact", head: true })
    .eq("active", true);
  return count;
}

export async function getAllSocios(active?: boolean) {
  "use cache";
  cacheLife("days");
  cacheTag("socios");

  const supabase = createAdmin();
  let query = supabase
    .from("Socios")
    .select("*")
    .order("full_name", { ascending: true });

  if (active !== undefined) {
    query = query.eq("active", active);
  }

  const { data } = await query;
  return data as Socio[];
}

export async function toggleActiveSocio(id: number, currentActive: boolean) {
  const supabase = createAdmin();

  const { error } = await supabase
    .from("Socios")
    .update({ active: !currentActive })
    .eq("id", id);

  if (error) {
    if (error.code === "42501") {
      return { error: "No estás autorizado a cambiar el estado del socio." };
    }
    return { error: "Hubo un error al cambiar el estado del socio." };
  }

  updateTag("socios");
  updateTag("socios-count");
}

export async function editSocio(id: number, data: Partial<Socio>) {
  const supabase = createAdmin();

  const { error } = await supabase.from("Socios").update(data).eq("id", id);

  if (error) {
    if (error.code === "42501") {
      return { error: "No estás autorizado a cambiar el socio." };
    }
    return { error: "Hubo un error al cambiar el socio." };
  }

  updateTag("socios");
}

export async function createSocio(data: Partial<Socio>) {
  const supabase = createAdmin();

  const { error } = await supabase.from("Socios").insert({
    full_name: data.full_name,
    nickname: data.nickname ?? null,
    active: true,
  });

  if (error) {
    if (error.code === "42501") {
      return { error: "No estás autorizado a crear un socio." };
    }
    return { error: "Hubo un error al crear el socio." };
  }

  updateTag("socios");
  updateTag("socios-count");
}

export async function getParticipationHistoric(
  socioId: number,
): Promise<MonthParticipation[]> {
  "use cache";
  cacheLife("days");
  cacheTag("participation-historic");

  const supabase = createAdmin();

  const { data, error } = await supabase
    .from("Jugador_Categoria_Mes")
    .select("*")
    .eq("jugador_id", socioId)
    .order("mes_id", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((participation) => ({
    id: participation.id,
    playerId: participation.jugador_id,
    monthId: participation.mes_id,
    categoryId: participation.categoria_id,
  }));
}
