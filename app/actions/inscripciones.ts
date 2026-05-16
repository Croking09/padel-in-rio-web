"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import { createAdmin } from "@/lib/supabase/admin";
import { ADMINS, sendMessage } from "@/lib/telegram/utils";
import { newInscripcionMessage } from "@/lib/telegram/answers";
import { Inscription } from "@/lib/types/inscription";

export async function inscribirTorneo(
  data: Omit<Inscription, "id" | "user_id">,
  categoriesNeeded: boolean,
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Debes iniciar sesión para inscribirte." };
  }

  const {
    torneo_id,
    phone_number,
    category,
    player_1_full_name,
    player_2_full_name,
  } = data;

  if (
    !torneo_id ||
    !phone_number ||
    !player_1_full_name ||
    !player_2_full_name ||
    (categoriesNeeded && !category)
  ) {
    return { error: "Faltan datos requeridos." };
  }

  const { data: torneo, error: torneoError } = await supabase
    .from("Torneos")
    .select("name, inscription_end_date, manually_closed")
    .eq("id", torneo_id)
    .single();

  if (torneoError || !torneo) {
    return { error: "El torneo no existe o ha sido eliminado." };
  }

  if (
    new Date() > new Date(torneo.inscription_end_date) ||
    torneo.manually_closed
  ) {
    return { error: "El plazo de inscripción se ha cerrado" };
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
    console.log(error);

    if (error.code === "23505") {
      // Unique violation
      return { error: "Ya estás inscrito en este torneo." };
    }

    if (error.code === "42501") {
      // RLS violation
      return { error: "No estás autorizado a inscribirte." };
    }

    return { error: "Hubo un error al procesar tu inscripción." };
  }

  const adminMessage = newInscripcionMessage(
    torneo.name,
    player_1_full_name,
    player_2_full_name,
    phone_number,
    category,
  );

  for (const admin of ADMINS) {
    await sendMessage(admin, adminMessage, { parse_mode: "Markdown" });
  }

  revalidatePath(`/admin/torneos/${torneo_id}/inscripciones`);
  return { success: true };
}

export async function getAllInscripcionesForOpenTorneos() {
  const supabase = createAdmin();
  const today = new Date().toISOString();

  const { data, error } = await supabase
    .from("Inscripciones")
    .select(
      `
      *,
      torneo:torneo_id (
        id,
        name,
        inscription_end_date,
        manually_closed
      )
    `,
    )
    .eq("torneo.manually_closed", false)
    .gte("torneo.inscription_end_date", today);

  if (error) {
    return { error: "Hubo un error al obtener las inscripciones." };
  }

  return { data };
}

export const getInscripcionesByTorneo = unstable_cache(
  async (torneo_id: string) => {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("Inscripciones")
      .select("*")
      .eq("torneo_id", torneo_id);

    if (error) {
      console.log(error);
      return { error: "Hubo un error al obtener las inscripciones." };
    }

    return { data };
  },
  ["inscripciones-by-torneo"],
  {
    revalidate: 86400, // 24 horas
    tags: ["inscripciones"],
  },
);

export async function toggleInscriptions(
  torneoId: number,
  shouldClose: boolean,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("Torneos")
    .update({
      manually_closed: shouldClose,
    })
    .eq("id", torneoId);

  if (error) {
    if (error.code === "42501") {
      // RLS violation
      return { error: "No estás autorizado a modificar las inscripciones." };
    }

    return { error: "Hubo un error al modificar las inscripciones." };
  }

  revalidatePath("/torneos");
  revalidatePath(`/torneos/inscripcion/${torneoId}`);
  revalidatePath(`/admin/torneos/${torneoId}/inscripciones`);
}

export async function getMyInscripcionesOpenTorneos(userId: string) {
  const supabase = createAdmin();
  const today = new Date().toISOString();

  const { data, error } = await supabase
    .from("Inscripciones")
    .select(
      `
      torneo_id,
      torneo:torneo_id (
        id,
        inscription_end_date,
        manually_closed
      )
    `,
    )
    .eq("user_id", userId)
    .eq("torneo.manually_closed", false)
    .gte("torneo.inscription_end_date", today);

  if (error) {
    console.error(error);
    return { data: [] };
  }

  return { data };
}
