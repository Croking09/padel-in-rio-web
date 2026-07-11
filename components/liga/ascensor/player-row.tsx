import { PlayerClassification } from "@/lib/types/classification";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Props = {
  player: PlayerClassification;
  index: number;
  categoryId: number;
  zebra: boolean;
  isLastCategory: boolean;
};

export function PlayerRow({
  player,
  index,
  categoryId,
  zebra,
  isLastCategory,
}: Props) {
  const isTop = index < 3 && categoryId !== 1;
  const isBottom = !isLastCategory && index >= 5;

  return (
    <TableRow
      className={cn(
        "border-b transition-none hover:bg-transparent",
        isTop &&
          "bg-linear-to-r from-success/15 from-0% via-success/10 via-20% to-transparent to-75%",

        isBottom &&
          "bg-linear-to-r from-destructive/15 from-0% via-destructive/10 via-20% to-transparent to-75%",
        !isTop && !isBottom && zebra && "bg-muted/50",
      )}
    >
      <TableCell className="w-10 text-center text-muted-foreground">
        {index + 1}
      </TableCell>

      <TableCell>
        <span className="font-medium text-foreground">
          {player.nickname ?? player.full_name}
        </span>
      </TableCell>

      <TableCell className="text-center font-bold">{player.points}</TableCell>

      <TableCell className="text-center font-semibold">
        <span
          className={cn(
            player.diff > 0 && "text-success",
            player.diff < 0 && "text-destructive",
            player.diff === 0 && "text-muted-foreground",
          )}
        >
          {player.diff > 0 ? `+${player.diff}` : player.diff}
        </span>
      </TableCell>

      <TableCell className="text-center text-muted-foreground">
        {player.games_for}
      </TableCell>

      <TableCell className="text-center text-muted-foreground">
        {player.matches_played}
      </TableCell>
    </TableRow>
  );
}
