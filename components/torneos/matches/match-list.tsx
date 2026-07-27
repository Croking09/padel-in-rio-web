"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TournamentMatchRow } from "@/lib/types/tournament-match";
import MatchCard from "@/components/torneos/matches/match-card";
import { TournamentRow } from "@/lib/types/tournament";

export default function MatchList({
  tournament,
  matches,
  showAdminControls,
}: {
  tournament: TournamentRow;
  matches: TournamentMatchRow[];
  showAdminControls: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredMatches = useMemo(() => {
    if (selectedCategory === null) return matches;

    return matches.filter((match) => match.category === selectedCategory);
  }, [matches, selectedCategory]);

  return (
    <>
      {tournament.categories && (
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="pt-4 md:pt-0 pb-4"
        >
          <TabsList variant="line">
            <TabsTrigger value={null}>Todos</TabsTrigger>

            {tournament.categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredMatches.map((match) => (
          <MatchCard
            key={match.id}
            tournament={tournament}
            match={match}
            showAdminControls={showAdminControls}
          />
        ))}
      </div>
    </>
  );
}
