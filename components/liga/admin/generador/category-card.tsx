import { Match } from "@/lib/types/match";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CategoryCard({
  category,
  matches,
}: {
  category: string;
  matches: Match[];
}) {
  return (
    <Card className="py-0 gap-0">
      <CardHeader className="px-4 py-2 border-b gap-0 [.border-b]:pb-2">
        <CardTitle className="font-bold text-lg">{category}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 p-4 gap-4">
        {matches.map((match, idx) => (
          <Card key={idx} className="bg-secondary p-4">
            <div className="grid grid-cols-2 gap-4">
              {match.players.map((player) => (
                <p key={player.id} className="truncate text-sm font-semibold">
                  {player.nickname || player.full_name}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
