import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col items-center px-4 py-8 md:grid md:grid-cols-3 md:px-8 lg:px-24">
        <div />
        <Skeleton className="mx-auto h-10 w-64" />
        <div />
      </div>

      <div className="mx-auto w-full px-4 pb-8 md:px-8 lg:px-24">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-full gap-0">
              <CardHeader className="flex items-center justify-between gap-4 border-b">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </CardHeader>

              <CardContent className="flex justify-between pt-4">
                <div className="w-3/5 space-y-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-5 w-8" />
                    <Skeleton className="h-5 w-8" />
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="h-5 w-8" />
                    <Skeleton className="h-5 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
