import { Database } from "@/lib/database.types";
import { CreateMonthInput, MonthRow } from "@/lib/types/month";

export type SeasonRow = Database["public"]["Tables"]["seasons"]["Row"];

export type SeasonInsert = Database["public"]["Tables"]["seasons"]["Insert"];

export type SeasonWithMonths = SeasonRow & { months: MonthRow[] };

export type CreateSeasonInput = SeasonInsert & { months: CreateMonthInput[] };
