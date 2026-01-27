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
    tags: ["torneos-count"],
  },
);

// Al modificar datos usar revalidateTag('torneos-count') para invalidar la caché
