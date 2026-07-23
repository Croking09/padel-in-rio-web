"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TournamentMatchRow } from "@/lib/types/tournament-match";
import MatchCard from "@/components/torneos/matches/match-card";

export default function MatchList({
  categories,
  matches,
}: {
  categories: string[] | null;
  matches: TournamentMatchRow[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredMatches = useMemo(() => {
    if (selectedCategory === null) return matches;

    return matches.filter((match) => match.category === selectedCategory);
  }, [matches, selectedCategory]);

  return (
    <>
      {categories && (
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="pt-4 md:pt-0 pb-4"
        >
          <TabsList variant="line">
            <TabsTrigger value={null}>Todas</TabsTrigger>

            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredMatches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </>
  );
}
