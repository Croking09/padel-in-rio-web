import { Database } from "@/lib/database.types";

export type TournamentMatchRow = Omit<
  Database["public"]["Tables"]["tournament_matches"]["Row"],
  "result"
> & { result: number[][] | null };

export type TournamentMatchInsert = Omit<
  Database["public"]["Tables"]["tournament_matches"]["Insert"],
  "result"
> & { result?: number[][] | null };
