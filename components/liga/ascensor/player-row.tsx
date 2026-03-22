import { PlayerClassification } from "@/lib/types/classification";

type Props = {
  player: PlayerClassification;
  index: number;
  categoryId: number;
  zebra: boolean;
};

export function PlayerRow({ player, index, categoryId, zebra }: Props) {
  const isTop = index < 3 && categoryId !== 1;
  const isBottom = index >= 5 && categoryId !== 5;

  const zebraBg = zebra ? "bg-primary/20" : "bg-background";

  const highlight = isTop
    ? "[background-image:linear-gradient(to_right,#22c55e20,transparent_40%)]"
    : isBottom
      ? "[background-image:linear-gradient(to_right,#ef444420,transparent_40%)]"
      : "";

  return (
    <tr
      className={`
        ${zebraBg}
        ${highlight}
      `}
    >
      <td className="py-2.5 px-3 text-center text-text-primary/70">
        {index + 1}
      </td>

      <td className="py-2.5 px-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {player.nickname ?? player.full_name}
          </span>
        </div>
      </td>

      <td className="py-2.5 px-3 text-center font-bold">{player.points}</td>

      <td className="py-2.5 px-3 text-center font-semibold">
        <span
          className={
            player.diff > 0
              ? "text-success"
              : player.diff < 0
                ? "text-error"
                : "text-text-primary/60"
          }
        >
          {player.diff > 0 ? `+${player.diff}` : player.diff}
        </span>
      </td>

      <td className="py-2.5 px-3 text-center text-text-primary/80">
        {player.games_for}
      </td>
    </tr>
  );
}
