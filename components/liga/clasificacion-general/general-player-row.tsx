import { PlayerClassification } from "@/lib/types/classification";

type Props = {
  player: PlayerClassification;
  index: number;
  zebra: boolean;
};

export function GeneralPlayerRow({ player, index, zebra }: Props) {
  const zebraBg = zebra ? "bg-primary/20" : "bg-background";

  return (
    <tr className={zebraBg}>
      <td className="py-2 px-2 text-center text-text-primary/70 text-xs">
        {index + 1}
      </td>
      <td className="py-2 px-2 font-medium">
        {player.nickname ?? player.full_name}
      </td>
      <td className="py-2 px-2 text-center font-bold">{player.points}</td>
      <td className="py-2 px-2 text-center font-semibold">
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
      <td className="py-2 px-2 text-center text-text-primary/80">
        {player.games_for}
      </td>
      <td className="py-2 px-2 text-center text-text-primary/80">
        {player.matches_played}
      </td>
    </tr>
  );
}
