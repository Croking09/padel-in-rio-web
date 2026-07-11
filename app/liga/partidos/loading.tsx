import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-3 items-center py-8 lg:px-24">
        <div />

        <h1 className="text-4xl font-bold text-center pb-8 md:pb-0">
          Partidos de Liga
        </h1>

        <div className="justify-self-end">
          <Skeleton className="h-9 w-56" />
        </div>
      </div>

      <div className="px-4 lg:px-24 pb-8">
        {Array.from({ length: 2 }).map((_, section) => (
          <div key={section} className="space-y-8">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-40" />
              <div className="w-full">
                <Separator />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, card) => (
                <Card
                  key={card}
                  className="flex flex-col rounded-lg border overflow-hidden py-0 gap-0 shadow-none"
                >
                  <CardHeader className="px-4 py-2 border-b">
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>

                  <CardContent className="p-4 space-y-4">
                    {Array.from({ length: 2 }).map((_, player) => (
                      <div key={player} className="space-y-2">
                        <Skeleton className="h-5 w-36" />
                      </div>
                    ))}

                    <Separator />

                    <div className="flex gap-4">
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 flex-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
