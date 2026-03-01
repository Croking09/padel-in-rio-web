export interface Inscription {
  id: number;
  torneo_id: number;
  user_id: string;
  phone_number: string;
  category: string | null;
  player_1_full_name: string;
  player_2_full_name: string;
}
