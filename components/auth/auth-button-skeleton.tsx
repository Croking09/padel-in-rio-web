import { Skeleton } from "@/components/ui/skeleton";

export default function AuthButtonSkeleton({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <Skeleton className="h-9 w-28 rounded-md" />
      {!compact && <Skeleton className="h-9 w-24 rounded-md" />}
    </div>
  );
}
