import { Database } from "@/lib/database.types";
import { CategoryRow } from "@/lib/types/category";
import { MemberRow } from "@/lib/types/member";

type MatchRow = Database["public"]["Tables"]["matches"]["Row"];

export type Match = Pick<MatchRow, "id"> & {
  matchday: number;
} & { category: Pick<CategoryRow, "id" | "name" | "order"> } & {
  players: Pick<MemberRow, "id" | "full_name" | "nickname">[];
};
