"use server";
import { createAdmin } from "@/lib/supabase/admin";
import { unstable_cache, revalidatePath } from "next/cache";
import { TorneoCreationState } from "@/components/torneos/admin/types";
import { createClient } from "@/lib/supabase/server";

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
  async (page: number = 1, pageSize: number = 5) => {
    const supabase = createAdmin();

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("Torneos")
      .select("*", { count: "exact" })
      .order("start_date", { ascending: false })
      .range(from, to);

    if (error) {
      return { data: [], page, pageSize };
    }

    const totalPages = count ? Math.ceil(count / pageSize) : 0;

    const dataWithImg = data.map((torneo) => {
      return {
        ...torneo,
        imageUrl: torneo.img_path
          ? supabase.storage.from("torneos").getPublicUrl(torneo.img_path).data
              .publicUrl
          : null,
      };
    });

    return {
      data: dataWithImg || [],
      page,
      pageSize,
      totalPages,
    };
  },
  ["torneos-paginated"],
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
  prevState: TorneoCreationState,
  formData: FormData,
): Promise<TorneoCreationState> {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  const inscription_end_date = formData.get("inscription_end_date") as string;
  const img_path = formData.get("img_path") as string | null;
  const categories = formData.getAll("categories") as string[];

  if (!name || !start_date || !end_date || !inscription_end_date) {
    if (img_path) {
      await supabase.storage.from("torneos").remove([img_path]);
    }

    return { error: "Faltan campos obligatorios." };
  }

  const start = new Date(start_date);
  const end = new Date(end_date);
  const inscriptionEnd = new Date(inscription_end_date);

  if (inscriptionEnd >= start) {
    if (img_path) {
      await supabase.storage.from("torneos").remove([img_path]);
    }

    return {
      error:
        "El cierre de inscripciones debe ser anterior al inicio del torneo.",
    };
  }

  if (start >= end) {
    if (img_path) {
      await supabase.storage.from("torneos").remove([img_path]);
    }

    return { error: "La fecha de inicio debe ser anterior a la fecha de fin." };
  }

  const { error } = await supabase.from("Torneos").insert({
    name,
    description,
    start_date,
    img_path,
    categories: categories.length > 0 ? categories : null,
    end_date,
    inscription_end_date,
    manually_closed: false,
  });

  if (error) {
    if (img_path) {
      await supabase.storage.from("torneos").remove([img_path]);
    }

    return { error: "Error al crear el torneo. Verifica los datos." };
  }

  revalidatePath("/"); // <-- Count
  revalidatePath("/torneos");
  return { success: true, message: "Torneo creado exitosamente." };
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
