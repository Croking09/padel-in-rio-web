import { Socio } from "./socio";

export interface Match {
  categoryId: number;
  categoryName: string;
  matchday: number;
  players: Socio[];
}
