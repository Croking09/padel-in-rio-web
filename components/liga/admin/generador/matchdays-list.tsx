import { Match } from "@/lib/types/match";
import MatchdaySection from "./matchday-categories";

export default function MatchdaysList({
  matchesByDay,
}: {
  matchesByDay: Record<number, Record<string, Match[]>>;
}) {
  return (
    <div className="space-y-8">
      {Object.entries(matchesByDay).map(([day, categories]) => (
        <MatchdaySection key={day} day={Number(day)} categories={categories} />
      ))}
    </div>
  );
}
