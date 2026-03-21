import { Socio } from "./socio";

export interface Match {
  id?: number;
  categoryId: number;
  categoryName: string;
  matchday: number;
  players: Socio[];
}
