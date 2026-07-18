import type { Database } from "@/lib/database.types";

export type MemberRow = Database["public"]["Tables"]["members"]["Row"];

export type MemberInsert = Database["public"]["Tables"]["members"]["Insert"];

export type MemberUpdate = Database["public"]["Tables"]["members"]["Update"];

export type CreateMemberInput = Pick<MemberRow, "full_name" | "nickname">;

export type Player = Pick<MemberRow, "id" | "full_name" | "nickname">;

export type PlayerWithParticipation = Player & {
  isAbsent: boolean;
};
