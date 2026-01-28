import { Skeleton } from "@/components/ui/skeleton";

export default function TorneosSkeleton() {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8">
      {[...Array(3)].map((_, index) => (
        <li
          key={index}
          className="flex flex-col md:flex-row md:gap-4 overflow-hidden"
        >
          <Skeleton className="relative w-full h-64 md:w-64" />
          <div className="flex flex-col p-4 gap-2 flex-1">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-20 w-full mt-2" />
          </div>
        </li>
      ))}
    </ul>
  );
}
