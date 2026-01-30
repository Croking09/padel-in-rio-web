"use server";
import { createAdmin } from "@/lib/supabase/admin";
import { unstable_cache } from "next/cache";

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
    revalidate: 21600, // 6 horas
    tags: ["torneos"],
  },
);

// Al modificar datos usar revalidateTag('torneos') para invalidar la caché

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
      console.error(error);
      return { data: [], page, pageSize };
    }

    const totalPages = count ? Math.ceil(count / pageSize) : 0;

    const dataWithImg = data.map((torneo) => {
      return {
        ...torneo,
        imageUrl: torneo.img_path
      ? supabase.storage
          .from("torneos")
          .getPublicUrl(torneo.img_path).data.publicUrl
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
    revalidate: 21600, // 6 horas
    tags: ["torneos"],
  },
);

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { InscripcionState } from "@/components/torneos/inscripcion/types";

export async function inscribirTorneo(prevState: InscripcionState, formData: FormData, categoriesNeeded: boolean) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Debes iniciar sesión para inscribirte." };
  }

  const torneo_id = formData.get("torneo_id") as string;
  const phone_number = formData.get("phone_number") as string;
  const category = formData.get("category") as string;
  const player_1_full_name = formData.get("player_1_full_name") as string;
  const player_2_full_name = formData.get("player_2_full_name") as string;

  if (!torneo_id || !phone_number || !player_1_full_name || !player_2_full_name || (categoriesNeeded && !category)) {
    return { error: "Faltan datos requeridos." };
  }

  const { error } = await supabase.from("Inscripciones").insert({
    torneo_id: torneo_id,
    user_id: user.id,
    phone_number: phone_number,
    category: category,
    player_1_full_name: player_1_full_name,
    player_2_full_name: player_2_full_name,
  });

  if (error) {
    if (error.code === '23505') { // Unique violation
        return { error: "Ya estás inscrito en este torneo." };
    }
    return { error: "Hubo un error al procesar tu inscripción." };
  }

  revalidatePath("/torneos/inscripcion");
  return { success: true, message: "¡Inscripción realizada con éxito!" };
}

export const getTorneoById = unstable_cache(
  async (id: string) => {
    const supabase = createAdmin();
    
    const { data: torneo, error } = await supabase
      .from("Torneos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return torneo;
  },
  ["torneo-by-id"],
  {
    revalidate: 21600, // 6 horas
    tags: ["torneos"],
  },
);
