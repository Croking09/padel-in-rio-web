import "server-only";

import { createAdmin } from "@/lib/supabase/admin";

export const classificationRepository = {
  async getAscensor(monthId: number) {
    const supabase = createAdmin();
    const { data, error } = await supabase.rpc("get_ascensor", {
      p_month_id: monthId,
    });

    if (error) throw error;
    return data;
  },

  async getGeneral(seasonId: number) {
    const supabase = createAdmin();
    const { data, error } = await supabase.rpc("get_general_classification", {
      p_season_id: seasonId,
    });

    if (error) throw error;
    return data;
  },
};
