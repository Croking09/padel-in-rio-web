"use server";
import { createAdmin } from "@/lib/supabase/admin";
import { unstable_cache } from "next/cache";

export const getLigasCount = unstable_cache(
  async () => {
    const supabase = createAdmin();
    const { count } = await supabase
      .from("Temporadas")
      .select("*", { count: "exact", head: true });
    return count;
  },
  ["ligas-count"],
  {
    revalidate: 86400, // 24 horas
    tags: ["ligas-count"],
  },
);

// Al modificar datos usar revalidateTag('ligas-count') para invalidar la caché
