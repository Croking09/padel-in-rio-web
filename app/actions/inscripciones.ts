"use server";

import { revalidatePath } from "next/cache";
import { InscripcionState } from "@/components/torneos/inscripcion/types";
import { createClient } from "@/lib/supabase/server";

export async function inscribirTorneo(
  prevState: InscripcionState,
  formData: FormData,
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

  const torneo_id = formData.get("torneo_id") as string;
  const phone_number = formData.get("phone_number") as string;
  const category = formData.get("category") as string;
  const player_1_full_name = formData.get("player_1_full_name") as string;
  const player_2_full_name = formData.get("player_2_full_name") as string;

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
    .select("inscription_end_date, manually_closed")
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

  revalidatePath(`/admin/torneos/${torneo_id}/inscripciones`);
  return { success: true, message: "¡Inscripción realizada con éxito!" };
}

export async function getInscripcionesByTorneo(torneo_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("Inscripciones")
    .select("*")
    .eq("torneo_id", torneo_id);

  if (error) {
    console.log(error);
    return { error: "Hubo un error al obtener las inscripciones." };
  }

  return { data };
}

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
