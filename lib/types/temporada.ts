import { Month } from "./month";

export type Temporada = {
  id: number;
  name: string;
  start_date: Date;
};

export type TemporadaWithMonths = Temporada & { months: Month[] };
