import { Skeleton } from "@/components/ui/skeleton";

export default function AuthButtonSkeleton() {
  return (
    <div className="flex gap-2">
      <Skeleton className="h-8 w-28 rounded-md" />
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>
  );
}
