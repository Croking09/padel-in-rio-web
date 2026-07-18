import { Database } from "@/lib/database.types";
import { CategoryRow } from "@/lib/types/category";
import { Player } from "@/lib/types/member";
import { MonthStatus } from "@/lib/types/month";

export type PlayerAssignmentRow =
  Database["public"]["Tables"]["player_category_assignments"]["Row"];

export type PlayerAssignmentWithPlayer = Pick<
  PlayerAssignmentRow,
  "id" | "category_id" | "month_id"
> & { player: Player };

export type AssignmentData = {
  categories: CategoryRow[];
  players: Player[];
  assignments: PlayerAssignmentRow[];
  status: MonthStatus;
  useFifthCategory: boolean;
};
