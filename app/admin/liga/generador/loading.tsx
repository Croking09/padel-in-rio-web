import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col items-center py-8 md:grid md:grid-cols-3 md:px-8 lg:px-24">
        <div />

        <h1 className="text-4xl font-bold text-center pb-4 md:pb-0">
          Generador de Partidos
        </h1>

        <div className="justify-self-end pt-4 md:pt-0">
          <Skeleton className="h-10 w-48" />
        </div>
      </div>

      <div className="space-y-8 px-4 pb-8 md:px-8 lg:px-24">
        {Array.from({ length: 2 }).map((_, day) => (
          <section key={day} className="space-y-4">
            <Skeleton className="h-8 w-40" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {Array.from({ length: 5 }).map((_, category) => (
                <Card key={category}>
                  <CardHeader>
                    <Skeleton className="h-6 w-24" />
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {Array.from({ length: 2 }).map((_, match) => (
                      <div key={match} className="rounded-md border p-3">
                        <div className="grid grid-cols-2 gap-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="flex justify-center gap-2 pb-8">
        <Skeleton className="h-10 w-44" />
      </div>
    </>
  );
}
