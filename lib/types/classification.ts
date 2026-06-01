export type PlayerClassification = {
  player_id: number;
  full_name: string;
  nickname: string | null;
  points: number;
  diff: number;
  games_for: number;
  matches_played: number;
};

export type CategoryClassification = {
  category: {
    id: number;
    name: string;
  };
  classification: PlayerClassification[];
};
