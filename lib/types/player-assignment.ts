import { Database } from "@/lib/database.types";
import { Player } from "@/lib/types/member";

type PlayerAssignmentRow =
  Database["public"]["Tables"]["player_category_assignments"]["Row"];

export type PlayerAssignmentWithPlayer = Pick<
  PlayerAssignmentRow,
  "id" | "category_id" | "month_id"
> & { player: Player };
