import "server-only";

import { createClient } from "@/lib/supabase/server";
import { MatchParticipantInsert } from "@/lib/types/match-participant";
import { SetInsert } from "@/lib/types/set";

export const matchRespository = {
  async registerResults(
    matchId: number,
    sets: SetInsert[],
    participants: MatchParticipantInsert[],
  ) {
    const supabase = await createClient();
    const { error } = await supabase.rpc("register_match_results", {
      p_match_id: matchId,
      p_sets: sets,
      p_participation: participants,
    });

    if (error) throw error;
  },
};
