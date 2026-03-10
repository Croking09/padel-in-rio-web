"use server";
import { createAdmin } from "@/lib/supabase/admin";
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
  async () => {
    const supabase = createAdmin();
    const { data } = await supabase
      .from("Socios")
      .select("*")
      .order("full_name", { ascending: true });
    return data;
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
  revalidatePath("/admin/socios");
}
