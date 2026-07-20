import CategoryTableSkeleton from "@/components/liga/ascensor/category-table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-3 items-center py-8 md:px-8 lg:px-24">
        <div />

        <h1 className="text-4xl font-bold text-center pb-4 md:pb-0">
          Ascensor
        </h1>

        <div className="justify-self-end">
          <Skeleton className="h-10 w-44" />
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-24 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <CategoryTableSkeleton />
          <CategoryTableSkeleton />
          <CategoryTableSkeleton />
          <CategoryTableSkeleton />
          <CategoryTableSkeleton />
        </div>
      </div>
    </>
  );
}
