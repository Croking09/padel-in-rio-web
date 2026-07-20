import "server-only";

import { createAdmin } from "@/lib/supabase/admin";
import { BonusInsert } from "@/lib/types/bonus";
import { createClient } from "@/lib/supabase/server";

export const bonusRepository = {
  async existsByMonth(monthId: number) {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("bonuses")
      .select("id")
      .eq("month_id", monthId)
      .limit(1); // Should only be 1 anyway

    if (error) throw error;
    return data.length > 0;
  },

  async insertBulk(input: BonusInsert[]) {
    const supabase = await createClient();
    const { error } = await supabase.from("bonuses").insert(input);

    if (error) throw error;
  },
};
