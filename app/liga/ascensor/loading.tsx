import { SkeletonCategoryTable } from "@/components/liga/ascensor/ascensor-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-[90%] mx-auto px-4 py-8">
      <Skeleton className="h-8 w-40 mx-auto mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SkeletonCategoryTable />
        <SkeletonCategoryTable />
        <SkeletonCategoryTable />
        <SkeletonCategoryTable />
        <SkeletonCategoryTable />
      </div>
    </div>
  );
}
