export interface Torneo {
  id: number;
  name: string;
  description: string | null;
  start_date: string;
  img_path: string | null;
  categories: string[] | null;
  end_date: string;
  inscription_end_date: string;
  manually_closed: boolean;
}
