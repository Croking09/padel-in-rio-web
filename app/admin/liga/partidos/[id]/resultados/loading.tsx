import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto space-y-8 pb-8 px-8">
      <h1 className="px-8 pt-8 text-center text-4xl font-bold lg:px-0">
        Registrar resultados
      </h1>

      <Card className="mx-auto max-w-5xl py-0 gap-0">
        <CardHeader className="flex flex-row items-center justify-between border-b px-4 py-2 [.border-b]:pb-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="size-4 rounded-full" />
        </CardHeader>
      </Card>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="py-0 gap-0">
            <CardHeader className="border-b px-4 py-2 gap-0 [.border-b]:pb-2">
              <Skeleton className="h-6 w-16" />
            </CardHeader>

            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-28" />
                </div>

                <Skeleton className="h-9 w-14 rounded-md" />
              </div>

              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-xs font-semibold text-muted-foreground">
                  VS
                </span>
                <Separator className="flex-1" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-5 w-30" />
                </div>

                <Skeleton className="h-9 w-14 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Skeleton className="mx-auto h-10 w-48 rounded-md" />
    </div>
  );
}
