import { CategoryClassification } from "@/lib/types/classification";
import { PlayerRow } from "@/components/liga/ascensor/player-row";

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
    <div className="mb-8 rounded-xl overflow-hidden border border-border">
      <div className="bg-primary px-4 py-3 border-b border-border">
        <span className="text-xs font-bold tracking-widest uppercase text-text-primary">
          {data.category.name}
        </span>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-primary/40 border-b border-border">
            <th className="w-10 py-2 px-3 text-center text-xs font-semibold uppercase">
              #
            </th>
            <th className="py-2 px-3 text-left text-xs font-semibold uppercase">
              Jugador
            </th>
            <th className="w-14 py-2 px-3 text-center text-xs font-semibold uppercase">
              Pts
            </th>
            <th className="w-14 py-2 px-3 text-center text-xs font-semibold uppercase">
              Dif
            </th>
            <th className="w-14 py-2 px-3 text-center text-xs font-semibold uppercase">
              JG
            </th>
            <th className="w-14 py-2 px-3 text-center text-xs font-semibold uppercase">
              PJ
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
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
        </tbody>
      </table>
    </div>
  );
}
