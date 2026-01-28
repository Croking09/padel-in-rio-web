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
    tags: ["torneos"],
  },
);

// Al modificar datos usar revalidateTag('torneos') para invalidar la caché

export const getTorneos = unstable_cache(
  async (page: number = 1, pageSize: number = 5) => {
    const supabase = createAdmin();
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("Torneos")
      .select("*", { count: "exact" })
      .order("start_date", { ascending: true })
      .range(from, to);

    if (error) {
      console.error(error);
      return { data: [], page, pageSize };
    }

    const totalPages = count ? Math.ceil(count / pageSize) : 0;

    const dataWithImg = data.map((torneo) => {
      return {
        ...torneo,
        imageUrl: torneo.img_path
      ? supabase.storage
          .from("torneos")
          .getPublicUrl(torneo.img_path).data.publicUrl
      : null,
      };
    });

    return {
      data: dataWithImg || [],
      page,
      pageSize,
      totalPages,
    };
  },
  ["torneos-paginated"],
  {
    revalidate: 21600, // 6 horas
    tags: ["torneos"],
  },
);
