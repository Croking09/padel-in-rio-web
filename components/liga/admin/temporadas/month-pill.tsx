import { MonthStatus, MonthRow } from "@/lib/types/month";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const STATUS_CONFIG: Record<MonthStatus, { className: string }> = {
  draft: {
    className: "bg-muted text-muted-foreground border-border",
  },
  locked: {
    className: "bg-warning/30 text-warning border-warning",
  },
  confirmed: {
    className: "bg-success/30 text-success border-success",
  },
};

export default function MonthPill({ month }: { month: MonthRow }) {
  const cfg = STATUS_CONFIG[month.status];
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm w-full md:w-fit ${cfg.className}`}
    >
      <span className="font-medium">
        {format(new Date(2000, month.month - 1), "LLLL", { locale: es })}{" "}
        {month.year}
      </span>
      {month.has_fifth_category && (
        <span className="text-xs rounded-full border border-current/20 px-2 py-1 font-semibold">
          5ª
        </span>
      )}
    </div>
  );
}
