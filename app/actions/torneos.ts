"use server";
import { createAdmin } from "@/lib/supabase/admin";
import { unstable_cache, revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { Torneo } from "@/lib/types/torneo";

export const getTorneosCount = unstable_cache(
  async () => {
    const supabase = createAdmin();
    const { count } = await supabase
      .from("Torneos")
      .select("*", { count: "exact", head: true });
    return count;
  },
  ["torneos-count"],
  {
    revalidate: 86400, // 24 horas
    tags: ["torneos"],
  },
);

export const getTorneos = unstable_cache(
  async () => {
    const supabase = createAdmin();

    const { data, error } = await supabase
      .from("Torneos")
      .select("*", { count: "exact" })
      .order("start_date", { ascending: false });

    if (error) {
      return [];
    }

    const dataWithImg = data.map((torneo) => {
      return {
        ...torneo,
        imageUrl: torneo.img_path
          ? supabase.storage.from("torneos").getPublicUrl(torneo.img_path).data
              .publicUrl
          : null,
      };
    });

    return (dataWithImg as Torneo[]) || [];
  },
  ["torneos"],
  {
    revalidate: 86400, // 24 horas
    tags: ["torneos"],
  },
);

export const getTorneoById = unstable_cache(
  async (id: string) => {
    const supabase = createAdmin();

    const { data: torneo, error } = await supabase
      .from("Torneos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }

    return torneo;
  },
  ["torneo-by-id"],
  {
    revalidate: 86400, // 24 horas
    tags: ["torneos"],
  },
);

export async function createTorneo(
  data: Omit<Torneo, "id" | "manually_closed">,
) {
  const supabase = await createClient();

  const {
    name,
    description,
    start_date,
    end_date,
    inscription_end_date,
    img_path,
    categories,
  } = data;

  if (!name || !start_date || !end_date || !inscription_end_date) {
    if (img_path) {
      await supabase.storage.from("torneos").remove([img_path]);
    }

    return { success: false, error: "Faltan campos obligatorios." };
  }

  const start = new Date(start_date);
  const end = new Date(end_date);
  const inscriptionEnd = new Date(inscription_end_date);

  if (inscriptionEnd >= start) {
    if (img_path) {
      await supabase.storage.from("torneos").remove([img_path]);
    }

    return {
      success: false,
      error:
        "El cierre de inscripciones debe ser anterior al inicio del torneo.",
    };
  }

  if (start >= end) {
    if (img_path) {
      await supabase.storage.from("torneos").remove([img_path]);
    }

    return {
      success: false,
      error: "La fecha de inicio debe ser anterior a la fecha de fin.",
    };
  }

  const { error } = await supabase.from("Torneos").insert({
    name,
    description,
    start_date,
    end_date,
    inscription_end_date,
    img_path: img_path ?? null,
    categories,
    manually_closed: false,
  });

  if (error) {
    if (img_path) {
      await supabase.storage.from("torneos").remove([img_path]);
    }

    return {
      success: false,
      error: "Error al crear el torneo. Verifica los datos.",
    };
  }

  revalidatePath("/");
  revalidatePath("/torneos");

  return {
    success: true,
  };
}

export async function deleteTorneo(torneoId: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("Torneos").delete().eq("id", torneoId);

  if (error) {
    if (error.code === "42501") {
      // RLS violation
      return { error: "No estás autorizado a eliminar el torneo." };
    }

    return { error: "Hubo un error al eliminar el torneo." };
  }

  revalidatePath("/"); // <-- Count
  revalidatePath("/torneos");
  revalidatePath(`/torneos/inscripcion/${torneoId}`);
}
