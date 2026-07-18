import "server-only";

import { createAdmin } from "@/lib/supabase/admin";
import { MonthUpdate } from "@/lib/types/month";
import { createClient } from "@/lib/supabase/server";

export const monthRepository = {
  async getById(monthId: number) {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("months")
      .select("*")
      .eq("id", monthId)
      .single();

    if (error) throw error;
    return data;
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
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, month: MonthUpdate) {
    const supabase = await createClient();

    const { error } = await supabase.from("months").update(month).eq("id", id);

    if (error) throw error;
  },
};
