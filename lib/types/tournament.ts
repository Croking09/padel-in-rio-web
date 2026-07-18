import { Database } from "@/lib/database.types";

export type TournamentRow = Database["public"]["Tables"]["tournaments"]["Row"];

export type TournamentInsert =
  Database["public"]["Tables"]["tournaments"]["Insert"];

export type TournamentUpdate =
  Database["public"]["Tables"]["tournaments"]["Update"];

export type TournamentWithImage = TournamentRow & { imageUrl: string | null };

export type CreateTournamentInput = Omit<TournamentInsert, "manually_closed">;
