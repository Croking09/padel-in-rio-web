import { Database } from "@/lib/database.types";

export type MatchParticipantRow =
  Database["public"]["Tables"]["match_participants"]["Row"];

export type MatchParticipantInsert =
  Database["public"]["Tables"]["match_participants"]["Insert"];
