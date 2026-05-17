import { MonthStatus, Month } from "@/lib/types/month";
import { formatMonth } from "@/lib/utils";

export const STATUS_CONFIG: Record<
  MonthStatus,
  { label: string; className: string }
> = {
  [MonthStatus.Draft]: {
    label: "Borrador",
    className: "bg-zinc-100 text-zinc-600 border-zinc-300",
  },
  [MonthStatus.Locked]: {
    label: "Bloqueado",
    className: "bg-amber-100 text-amber-600 border-amber-300",
  },
  [MonthStatus.Confirmed]: {
    label: "Confirmado",
    className: "bg-emerald-100 text-emerald-600 border-emerald-300",
  },
};

export default function MonthPill({ month }: { month: Month }) {
  const cfg = STATUS_CONFIG[month.status];
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${cfg.className}`}
    >
      <span className="font-medium">
        {formatMonth(month.month)} {month.year}
      </span>
      {month["5_category"] && (
        <span className="text-xs rounded-full bg-white/60 border border-current/20 px-1.5 py-0.5 font-semibold">
          5ª
        </span>
      )}
      <span className="text-xs opacity-70">{cfg.label}</span>
    </div>
  );
}
