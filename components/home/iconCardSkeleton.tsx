import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function IconCardSkeleton() {
  return (
    <Card className="aspect-square md:h-36 overflow-hidden">
      <CardContent className="flex h-full flex-col items-center justify-center gap-4 p-0">
        <Skeleton className="size-14 shrink-0 rounded-full" />

        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
