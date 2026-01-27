"use server";
import { createAdmin } from "@/lib/supabase/admin";
import { unstable_cache } from "next/cache";

export const getSociosCount = unstable_cache(
  async () => {
    const supabase = createAdmin();
    const { count } = await supabase
      .from("Socios")
      .select("*", { count: "exact", head: true });
    return count;
  },
  ["socios-count"],
  {
    revalidate: 3600, // 1 hora
    tags: ["socios-count"],
  },
);

// Al modificar datos usar revalidateTag('socios-count') para invalidar la caché
