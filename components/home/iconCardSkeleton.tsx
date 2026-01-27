import { Skeleton } from "@/components/ui/skeleton";

export default function IconCardSkeleton() {
  return (
    <div className="aspect-square h-36 py-2 gap-2 rounded-2xl inline-flex flex-col items-center justify-center bg-primary shadow-[10px_10px_10px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col items-center justify-center">
        <Skeleton className="h-5 w-10" />
        <Skeleton className="h-6 w-20 mt-2" />
      </div>

      <Skeleton className="size-15 shrink-0 rounded-full" />
    </div>
  );
}
