import { Database } from "@/lib/database.types";
import { CategoryRow } from "@/lib/types/category";

export type AscensorRow =
  Database["public"]["Functions"]["get_ascensor"]["Returns"][number];

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

export type CategoryClassification = {
  category: Pick<CategoryRow, "id" | "name" | "order">;
  classification: PlayerClassification[];
};
