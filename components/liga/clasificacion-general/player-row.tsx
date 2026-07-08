import { PlayerClassification } from "@/lib/types/classification";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Props = {
  player: PlayerClassification;
  index: number;
  zebra: boolean;
};

export default function PlayerRow({ player, index, zebra }: Props) {
  return (
    <TableRow
      className={cn(
        "border-b transition-none hover:bg-transparent",
        zebra && "bg-muted/50",
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
