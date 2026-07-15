import "server-only";

import { createAdmin } from "@/lib/supabase/admin";

export const monthRepository = {
  async getById(monthId: number) {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("months")
      .select("*")
      .eq("id", monthId)
      .limit(1);

    if (error) throw error;
    return data[0];
  },

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

  async getByMonthAndYear(month: number, year: number) {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("months")
      .select("*")
      .eq("month", month)
      .eq("year", year)
      .limit(1);

    if (error) throw error;
    return data[0];
  },
};
