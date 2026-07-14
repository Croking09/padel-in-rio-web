import "server-only";

import { createAdmin } from "@/lib/supabase/admin";

export const monthRepository = {
  async getBySeason(seasonId: number) {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("months")
      .select("*")
      .eq("season_id", seasonId)
      .order("year")
      .order("month", { ascending: true });

    if (error) throw error;
    return data;
  },
};
