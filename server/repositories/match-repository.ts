import { createClient } from "@/lib/supabase/server";
import { RegisterMatchParticipant } from "@/lib/types/match-participant";
import { SetInsert } from "@/lib/types/set";
import "server-only";

export const matchRespository = {
  async registerResults(
    matchId: number,
    sets: SetInsert[],
    participants: RegisterMatchParticipant[],
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
