import "server-only";

import { createAdmin } from "@/lib/supabase/admin";

export const setRepository = {
  async existsBatch(matchIds: number[]) {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("sets")
      .select("*")
      .in("match_id", matchIds);

    if (error) throw error;
    return data.map((set) => set.match_id);
  },

  async getByMatch(matchId: number) {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("sets")
      .select(
        `
          id,
          order,
          pair1_score,
          pair2_score,
          player1:members!pair1_player1_id(
            id,
            full_name,
            nickname
          ),
          player2:members!pair1_player2_id(
            id,
            full_name,
            nickname
          ),
          player3:members!pair2_player1_id(
            id,
            full_name,
            nickname
          ),
          player4:members!pair2_player2_id(
            id,
            full_name,
            nickname
          )
        `,
      )
      .eq("match_id", matchId)
      .order("order");

    if (error) throw error;
    return data;
  },
};
