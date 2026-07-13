import { MonthStatus, Month } from "@/lib/types/month";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const STATUS_CONFIG: Record<
  MonthStatus,
  { label: string; className: string }
> = {
  [MonthStatus.Draft]: {
    label: "Borrador",
    className: "bg-muted text-muted-foreground border-border",
  },
  [MonthStatus.Locked]: {
    label: "Bloqueado",
    className: "bg-warning/30 text-warning border-warning",
  },
  [MonthStatus.Confirmed]: {
    label: "Confirmado",
    className: "bg-success/30 text-success border-success",
  },
};

export default function MonthPill({ month }: { month: Month }) {
  const cfg = STATUS_CONFIG[month.status];
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm w-full md:w-fit ${cfg.className}`}
    >
      <span className="font-medium">
        {format(new Date(2000, month.month - 1), "LLLL", { locale: es })}{" "}
        {month.year}
      </span>
      {month["5_category"] && (
        <span className="text-xs rounded-full border border-current/20 px-2 py-1 font-semibold">
          5ª
        </span>
      )}
      <span className="text-xs opacity-90">{cfg.label}</span>
    </div>
  );
}
