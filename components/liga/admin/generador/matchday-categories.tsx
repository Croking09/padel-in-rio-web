import { Match } from "@/lib/types/match";
import CategoryCard from "./category-card";

export default function MatchdayCategories({
  day,
  categories,
}: {
  day: number;
  categories: Record<string, Match[]>;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Jornada {day}</h2>

      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(categories).map(([category, matches]) => (
          <CategoryCard key={category} category={category} matches={matches} />
        ))}
      </div>
    </section>
  );
}
