import { Database } from "@/lib/database.types";
import { Player } from "@/lib/types/member";

type SetRow = Database["public"]["Tables"]["sets"]["Row"];
export type SetInsert = Database["public"]["Tables"]["sets"]["Insert"];

export type PlayerWithParticipation = Player & {
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
