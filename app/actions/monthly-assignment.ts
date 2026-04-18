"use server";

import { createAdmin } from "@/lib/supabase/admin";
import { MonthStatus } from "@/lib/types/month";
import { revalidatePath } from "next/cache";

export type Player = {
  id: number;
  full_name: string;
  nickname: string | null;
};

export type Category = {
  id: number;
  name: string;
  order: number;
};

export type Assignment = {
  jugador_id: number;
  categoria_id: number;
  id?: number; // Optional for new assignments before save
};

export type AssignmentData = {
  categories: Category[];
  players: Player[];
  assignments: Assignment[];
  status: MonthStatus;
};

export type Month = {
  id: number;
  month: number;
  year: number;
  status: MonthStatus;
  temporada_id: number;
  temporada_name?: string;
};

export async function getAssignmentData(
  monthId: number,
): Promise<AssignmentData> {
  const supabase = createAdmin();

  // Fetch month status
  const { data: monthData, error: monthError } = await supabase
    .from("Meses")
    .select("status")
    .eq("id", monthId)
    .single();

  if (monthError) throw monthError;

  // Fetch categories
  const { data: categories, error: catError } = await supabase
    .from("Categorias")
    .select("*")
    .order("order");

  if (catError) throw catError;

  // Fetch all players (Socios)
  const { data: players, error: playerError } = await supabase
    .from("Socios")
    .select("*")
    .eq("active", true);

  if (playerError) throw playerError;

  // Fetch current assignments for the month
  const { data: assignments, error: assignError } = await supabase
    .from("Jugador_Categoria_Mes")
    .select("id, jugador_id, categoria_id")
    .eq("mes_id", monthId);

  if (assignError) throw assignError;

  return {
    categories: categories || [],
    players: players || [],
    assignments: assignments || [],
    status: monthData.status as MonthStatus,
  };
}

export async function saveAssignments(
  monthId: number,
  assignments: { jugador_id: number; categoria_id: number }[],
) {
  const supabase = createAdmin();

  // Verify month is not locked
  const { data: month } = await supabase
    .from("Meses")
    .select("status")
    .eq("id", monthId)
    .single();
  if (month?.status === "locked") {
    throw new Error("El mes está cerrado y no se puede editar.");
  }

  // 1. Delete all existing assignments for this month
  const { error: deleteError } = await supabase
    .from("Jugador_Categoria_Mes")
    .delete()
    .eq("mes_id", monthId);

  if (deleteError) throw deleteError;

  // 2. Insert new assignments
  if (assignments.length > 0) {
    const toInsert = assignments.map((a) => ({
      mes_id: monthId,
      jugador_id: a.jugador_id,
      categoria_id: a.categoria_id,
    }));

    const { error: insertError } = await supabase
      .from("Jugador_Categoria_Mes")
      .insert(toInsert);

    if (insertError) throw insertError;
  }

  revalidatePath("/admin/liga/asignacion");
}

export async function confirmMonth(monthId: number) {
  const supabase = createAdmin();

  const { error } = await supabase
    .from("Meses")
    .update({ status: "locked" })
    .eq("id", monthId);

  if (error) throw error;

  revalidatePath("/admin/liga/asignacion");
  revalidatePath("/liga/partidos");
}
