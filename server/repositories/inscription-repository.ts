import "server-only";

import { createAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { InscriptionInsert } from "@/lib/types/inscription";

export const inscriptionRepository = {
  async insert(input: InscriptionInsert) {
    const supabase = await createClient();
    const { error } = await supabase.from("inscriptions").insert(input);
    if (error) throw error;
  },

  async findByTournamentId(tournamentId: number) {
    const supabase = createAdmin();
    const { data, error } = await supabase
      .from("inscriptions")
      .select("*")
      .eq("tournament_id", tournamentId);

    if (error) throw error;
    return data;
  },

  async findAllForOpenTournaments() {
    const supabase = createAdmin();
    const today = new Date().toISOString();

    const { data, error } = await supabase
      .from("inscriptions")
      .select(
        `
        *,
        tournament:tournament_id (
          name,
          inscription_end_date,
          manually_closed
        )
      `,
      )
      .eq("tournament.manually_closed", false)
      .gte("tournament.inscription_end_date", today);

    if (error) throw error;
    return data;
  },

  async findMyOpenTournamentInscriptions(userId: string) {
    const supabase = createAdmin();
    const today = new Date().toISOString();

    const { data, error } = await supabase
      .from("inscriptions")
      .select(
        `
        tournament_id,
        tournament:tournament_id (
          id,
          inscription_end_date,
          manually_closed
        )
      `,
      )
      .eq("user_id", userId)
      .eq("tournament.manually_closed", false)
      .gte("tournament.inscription_end_date", today);

    if (error) throw error;
    return data;
  },
};
