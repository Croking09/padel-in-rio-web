"use server";
import { createAdmin } from "@/lib/supabase/admin";
import type { MonthParticipation } from "@/lib/types/monthParticipation";
import { Socio } from "@/lib/types/socio";
import { revalidatePath, unstable_cache } from "next/cache";

export const getActiveSociosCount = unstable_cache(
  async () => {
    const supabase = createAdmin();
    const { count } = await supabase
      .from("Socios")
      .select("*", { count: "exact", head: true })
      .eq("active", true);
    return count;
  },
  ["socios-count"],
  {
    revalidate: 86400, // 1 dia
    tags: ["socios"],
  },
);

export const getAllSocios = unstable_cache(
  async (active?: boolean) => {
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
  },
  ["socios"],
  {
    revalidate: 86400, // 1 dia
    tags: ["socios"],
  },
);

export async function toggleActiveSocio(id: number, currentActive: boolean) {
  const supabase = createAdmin();

  const { error } = await supabase
    .from("Socios")
    .update({ active: !currentActive })
    .eq("id", id);

  if (error) {
    if (error.code === "42501") {
      // RLS violation
      return { error: "No estás autorizado a cambiar el estado del socio." };
    }

    return { error: "Hubo un error al cambiar el estado del socio." };
  }

  revalidatePath("/");
  revalidatePath("/asociacion/historico");
  revalidatePath("/admin/socios");
}

export async function editSocio(id: number, data: Partial<Socio>) {
  const supabase = createAdmin();

  const { error } = await supabase.from("Socios").update(data).eq("id", id);

  if (error) {
    if (error.code === "42501") {
      // RLS violation
      return { error: "No estás autorizado a cambiar el socio." };
    }

    return { error: "Hubo un error al cambiar el socio." };
  }

  revalidatePath("/asociacion/historico");
  revalidatePath("/admin/socios");
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
      // RLS violation
      return { error: "No estás autorizado a crear un socio." };
    }
    return { error: "Hubo un error al crear el socio." };
  }

  revalidatePath("/");
  revalidatePath("/asociacion/historico");
  revalidatePath("/admin/socios");
}

export const getParticipationHistoric = unstable_cache(
  async (socioId: number): Promise<MonthParticipation[]> => {
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
  },
  ["participation-historic"],
  {
    revalidate: 86400, // 1 dia
    tags: ["participation-historic"],
  },
);
