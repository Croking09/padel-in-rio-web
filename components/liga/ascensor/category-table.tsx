import { CategoryClassification } from "@/lib/types/classification";
import { PlayerRow } from "@/components/liga/ascensor/player-row";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Props = {
  data: CategoryClassification;
  isLast: boolean;
};

export function CategoryTable({ data, isLast }: Props) {
  const sorted = [...data.classification].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.diff !== a.diff) return b.diff - a.diff;
    return b.games_for - a.games_for;
  });

  return (
    <Card className="overflow-hidden py-0 gap-0">
      <CardHeader className="px-4 py-2 gap-0 border-b">
        <CardTitle className="font-bold tracking-widest uppercase">
          {data.category.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 text-center text-xs font-semibold uppercase text-muted-foreground">
                #
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase text-muted-foreground">
                Jugador
              </TableHead>
              <TableHead className="w-14 text-center text-xs font-semibold uppercase text-muted-foreground">
                Pts
              </TableHead>
              <TableHead className="w-14 text-center text-xs font-semibold uppercase text-muted-foreground">
                Dif
              </TableHead>
              <TableHead className="w-14 text-center text-xs font-semibold uppercase text-muted-foreground">
                JG
              </TableHead>
              <TableHead className="w-14 text-center text-xs font-semibold uppercase text-muted-foreground">
                PJ
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sorted.map((player, i) => (
              <PlayerRow
                key={player.player_id}
                player={player}
                index={i}
                categoryId={data.category.id}
                zebra={i % 2 === 0}
                isLastCategory={isLast}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
