"use server";

import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export const getAscensor = unstable_cache(
  async (monthId: number) => {
    const supabase = await createClient({ useCookies: false });

    const { data: categories, error: categoriesError } = await supabase
      .from("Categorias")
      .select("id, name, order");

    if (categoriesError) console.error(categoriesError);
    if (!categories?.length) return [];

    const results = await Promise.all(
      categories.map(async (category) => {
        const { data, error } = await supabase.rpc("get_month_classification", {
          p_mes_id: monthId,
          p_categoria_id: category.id,
        });

        if (error) console.error(`Error en categoría ${category.id}`, error);

        return {
          category,
          classification: data ?? [],
        };
      }),
    );

    return results;
  },
  ["ascensor"],
  {
    revalidate: 86400, // 1 dia
    tags: ["ascensor"],
  },
);

export const getGeneralClassification = unstable_cache(
  async (temporadaId: number) => {
    const supabase = await createClient({ useCookies: false });

    const { data, error } = await supabase.rpc("get_global_classification", {
      p_temporada_id: temporadaId,
    });

    if (error) console.error(error);

    return data ?? [];
  },
  ["general"],
  {
    revalidate: 86400,
    tags: ["general"],
  },
);
