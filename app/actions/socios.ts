"use server";
import { createAdmin } from "@/lib/supabase/admin";

export async function getSociosCount() {
  const admin = createAdmin();

  const { count, error } = await admin
    .from("Socios")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count;
}
