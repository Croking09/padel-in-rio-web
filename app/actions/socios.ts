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
    tags: ["socios"],
  },
);

// Al modificar datos usar revalidateTag('socios') para invalidar la caché

export const getAllSocios = unstable_cache(
  async () => {
    const supabase = createAdmin();
    const { data } = await supabase
      .from("Socios")
      .select("*");
    return data;
  },
  ["socios-all"],
  {
    revalidate: 3600, // 1 hora
    tags: ["socios"],
  },
);