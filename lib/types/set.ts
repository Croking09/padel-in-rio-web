import { Database } from "@/lib/database.types";
import { MemberRow } from "@/lib/types/member";

type SetRow = Database["public"]["Tables"]["sets"]["Row"];

export type PlayerWithParticipation = Pick<
  MemberRow,
  "id" | "full_name" | "nickname"
> & {
  isAbsent: boolean;
};

export type SetWithParticipation = Pick<
  SetRow,
  "id" | "order" | "pair1_score" | "pair2_score"
> & {
  player1: PlayerWithParticipation;
  player2: PlayerWithParticipation;
  player3: PlayerWithParticipation;
  player4: PlayerWithParticipation;
};
