import "server-only";

import { createAdmin } from "@/lib/supabase/admin";

export const matchdayRepository = {
  async getByMonth(monthId: number) {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("matchdays")
      .select(
        `
      order,
      matches (
        id,
        category:categories ( id, name, order ),
        match_participants (
          id,
          player:members!player_id ( id, full_name, nickname )
        )
      )
    `,
      )
      .eq("month_id", monthId)
      .order("order");

    if (error) throw error;
    return data;
  },
};
