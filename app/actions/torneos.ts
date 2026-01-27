"use server";
import { createAdmin } from "@/lib/supabase/admin";

export async function getTorneosCount() {
  const admin = createAdmin();

  const { count, error } = await admin
    .from("Torneos")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count;
}
