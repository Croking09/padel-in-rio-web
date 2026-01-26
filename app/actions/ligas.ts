import { admin } from "@/lib/supabase/admin";

export async function getLigasCount() {
  const { count, error } = await admin
    .from("Temporadas")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count;
}
