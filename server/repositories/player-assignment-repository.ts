import { createAdmin } from "@/lib/supabase/admin";
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
};
