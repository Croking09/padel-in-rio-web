import { Skeleton } from "@/components/ui/skeleton";
import AssignmentBoardSkeleton from "./assignment-board-skeleton";

export default function AssignmentPageSkeleton() {
  return (
    <div className="container mx-auto p-4 flex flex-col gap-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>

      <AssignmentBoardSkeleton />
    </div>
  );
}
