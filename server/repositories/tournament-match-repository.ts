import { Database } from "@/lib/database.types";
import { createAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  TournamentMatchInsert,
  TournamentMatchRow,
  TournamentMatchUpdate,
} from "@/lib/types/tournament-match";
import "server-only";

export const tournamentMatchRepository = {
  async insert(input: TournamentMatchInsert) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("tournament_matches")
      .insert(
        input as Database["public"]["Tables"]["tournament_matches"]["Insert"],
      );

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

  async update(matchId: number, input: TournamentMatchUpdate) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("tournament_matches")
      .update(
        input as Database["public"]["Tables"]["tournament_matches"]["Update"],
      )
      .eq("id", matchId);

    if (error) throw error;
  },
};
