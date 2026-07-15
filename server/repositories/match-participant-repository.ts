import "server-only";

import { createAdmin } from "@/lib/supabase/admin";

export const matchParticipantRepository = {
  async getByMatch(matchId: number) {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("match_participants")
      .select("*")
      .eq("match_id", matchId);

    if (error) throw error;
    return data;
  },
};
