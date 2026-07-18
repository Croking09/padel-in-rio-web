import { createAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import "server-only";

export const playerAssignmentRepository = {
  async getByMonth(monthId: number) {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("player_category_assignments")
      .select("id, category_id, player:members(id, full_name, nickname)")
      .eq("month_id", monthId);

    if (error) throw error;
    return data;
  },

  async saveForMonth(
    monthId: number,
    assignments: { player_id: number; category_id: number }[],
  ) {
    const supabase = await createClient();

    const { error } = await supabase.rpc("save_month_assignments", {
      p_month_id: monthId,
      p_assignments: assignments,
    });

    if (error) throw error;
  },
};
