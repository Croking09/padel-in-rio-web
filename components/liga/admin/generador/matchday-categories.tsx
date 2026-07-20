import { CategoryMatches } from "@/lib/types/match";
import CategoryCard from "./category-card";

export default function MatchdayCategories({
  day,
  categories,
}: {
  day: number;
  categories: CategoryMatches[];
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Jornada {day}</h2>

      <div className="grid gap-4 md:grid-cols-3">
        {categories.map(({ category, matches }) => (
          <CategoryCard
            key={category.id}
            category={category}
            matches={matches}
          />
        ))}
      </div>
    </section>
  );
}
