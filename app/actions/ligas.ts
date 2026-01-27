"use server";
import { createAdmin } from "@/lib/supabase/admin";

export async function getLigasCount() {
  const admin = createAdmin();

  const { count, error } = await admin
    .from("Temporadas")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count;
}
