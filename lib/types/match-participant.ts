import { Database } from "@/lib/database.types";
import { Player } from "@/lib/types/member";

export type MatchParticipantRow =
  Database["public"]["Tables"]["match_participants"]["Row"];

type MatchParticipantInsert =
  Database["public"]["Tables"]["match_participants"]["Insert"];

export type MatchParticipantWithPlayer = Pick<
  MatchParticipantRow,
  "id" | "match_id"
> & { player: Player } & { substitute: Player | null };

export type RegisterMatchParticipant = Pick<
  MatchParticipantInsert,
  "player_id" | "substitute_id"
>;
