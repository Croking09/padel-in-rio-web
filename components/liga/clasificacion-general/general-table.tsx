import PlayerRow from "./player-row";
import { PlayerClassification } from "@/lib/types/classification";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  data: PlayerClassification[];
};

export default function GeneralClassificationTable({ data }: Props) {
  return (
    <div className="rounded-xl overflow-hidden border md:w-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 text-center text-xs font-semibold uppercase text-muted-foreground">
              #
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
              Jugador
            </TableHead>
            <TableHead className="w-20 text-center text-xs font-semibold uppercase text-muted-foreground">
              Pts
            </TableHead>
            <TableHead className="w-20 text-center text-xs font-semibold uppercase text-muted-foreground">
              Dif
            </TableHead>
            <TableHead className="w-20 text-center text-xs font-semibold uppercase text-muted-foreground">
              JG
            </TableHead>
            <TableHead className="w-20 text-center text-xs font-semibold uppercase text-muted-foreground">
              PJ
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((player, i) => (
            <PlayerRow
              key={player.player_id}
              player={player}
              index={i}
              zebra={i % 2 === 0}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
