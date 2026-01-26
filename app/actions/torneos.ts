"use server";
import { admin } from "@/lib/supabase/admin";

export async function getTorneosCount() {
  const { count, error } = await admin
    .from("Torneos")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count;
}
