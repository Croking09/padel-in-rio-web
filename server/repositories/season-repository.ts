import "server-only";

import { createAdmin } from "@/lib/supabase/admin";
import { CreateSeasonInput } from "@/lib/types/season";
import { createClient } from "@/lib/supabase/server";

export const seasonRepository = {
  async count() {
    const supabase = createAdmin();
    const { count, error } = await supabase
      .from("seasons")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count;
  },

  async getAll() {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("seasons")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getAllWithMonths() {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("seasons")
      .select(
        `
        *,
        months (*)
      `,
      )
      .order("start_date", { ascending: false });

    if (error) throw error;
    return data;
  },

  async insert(input: CreateSeasonInput) {
    const supabase = await createClient();
    const { error } = await supabase.rpc("create_season_with_months", {
      p_name: input.name,
      p_start_date: input.start_date ?? null!, // start_date is NULLABLE in DB
      p_months: input.months,
    });
    if (error) throw error;
  },
};
