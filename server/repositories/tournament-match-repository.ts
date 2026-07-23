import { createAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  TournamentMatchInsert,
  TournamentMatchRow,
} from "@/lib/types/tournament-match";
import "server-only";

export const tournamentMatchRepository = {
  async insert(input: TournamentMatchInsert) {
    const supabase = await createClient();
    const { error } = await supabase.from("tournament_matches").insert(input);

    if (error) throw error;
  },

  async getByTournament(tournamentId: number) {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("tournament_matches")
      .select("*")
      .eq("tournament_id", tournamentId)
      .order("scheduled_datetime");

    if (error) throw error;
    return data as TournamentMatchRow[];
  },
};
