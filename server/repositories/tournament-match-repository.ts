import { createClient } from "@/lib/supabase/server";
import { TournamentMatchInsert } from "@/lib/types/tournament-match";
import "server-only";

export const tournamentMatchRepository = {
  async insert(input: TournamentMatchInsert) {
    const supabase = await createClient();
    const { error } = await supabase.from("tournament_matches").insert(input);

    if (error) throw error;
  },
};
