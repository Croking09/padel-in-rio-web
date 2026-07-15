import { Database } from "@/lib/database.types";

export type AscensorRow =
  Database["public"]["Functions"]["get_ascensor"]["Returns"][number];

export type CategoryClassification = {
  category: { id: number; name: string; order: number };
  classification: PlayerClassification[];
};

export type PlayerClassification = Pick<
  AscensorRow,
  | "player_id"
  | "full_name"
  | "nickname"
  | "points"
  | "diff"
  | "games_for"
  | "matches_played"
>;
