import { GeneralPlayerRow } from "./general-player-row";
import { PlayerClassification } from "@/lib/types/classification";

type Props = {
  data: PlayerClassification[];
};

export function GeneralTable({ data }: Props) {
  return (
    <div className="rounded-xl overflow-hidden border border-border md:w-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-primary/40 border-b border-border">
            <th className="w-8 py-2 px-2 text-center text-xs font-semibold uppercase">
              #
            </th>
            <th className="py-2 px-2 text-left text-xs font-semibold uppercase">
              Jugador
            </th>
            <th className="w-20 py-2 px-2 text-center text-xs font-semibold uppercase">
              Pts
            </th>
            <th className="w-20 py-2 px-2 text-center text-xs font-semibold uppercase">
              Dif
            </th>
            <th className="w-20 py-2 px-2 text-center text-xs font-semibold uppercase">
              JG
            </th>
            <th className="w-20 py-2 px-2 text-center text-xs font-semibold uppercase">
              PJ
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((player, i) => (
            <GeneralPlayerRow
              key={player.player_id}
              player={player}
              index={i}
              zebra={i % 2 === 0}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
