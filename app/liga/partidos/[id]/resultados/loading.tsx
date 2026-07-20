import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <h1 className="py-8 text-center text-4xl font-bold px-8 lg:px-0">
        Resultados del partido
      </h1>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 pb-8 px-8 lg:px-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="py-0 gap-0">
            <CardHeader className="px-4 py-2 border-b gap-0 [.border-b]:pb-2">
              <Skeleton className="h-6 w-20" />
            </CardHeader>

            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between pr-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-28" />
                </div>

                <Skeleton className="h-8 w-8" />
              </div>

              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-xs font-semibold text-muted-foreground">
                  VS
                </span>
                <Separator className="flex-1" />
              </div>

              <div className="flex items-center justify-between pr-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-30" />
                  <Skeleton className="h-5 w-36" />
                </div>

                <Skeleton className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
