import { admin } from "@/lib/supabase/admin";

export async function getSociosCount() {
  const { count, error } = await admin
    .from("Socios")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count;
}