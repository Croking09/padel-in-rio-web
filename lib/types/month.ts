import { Database } from "@/lib/database.types";

export type MonthStatus = Database["public"]["Enums"]["month_status"];

export type MonthRow = Database["public"]["Tables"]["months"]["Row"];

export type MonthInsert = Database["public"]["Tables"]["months"]["Insert"];

export type MonthUpdate = Database["public"]["Tables"]["months"]["Update"];

export type CreateMonthInput = Pick<MonthInsert, "month" | "year">;
