import { Database } from "@/lib/database.types";

export type TournamentMatchRow =
  Database["public"]["Tables"]["tournament_matches"]["Row"];

export type TournamentMatchInsert =
  Database["public"]["Tables"]["tournament_matches"]["Insert"];
