export enum MonthStatus {
  Draft = "draft",
  Locked = "locked",
  Confirmed = "confirmed",
}

export type Month = {
  id: number;
  temporada_id: number;
  month: number;
  year: number;
  status: MonthStatus;
  ["5_category"]: boolean;
};
