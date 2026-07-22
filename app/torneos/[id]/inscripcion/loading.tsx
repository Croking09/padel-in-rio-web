import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <Skeleton className="h-10 w-96 mx-auto my-8" />

      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-5 w-80" />
          <Skeleton className="h-4 w-56" />
        </div>

        <div className="mx-auto w-2/3 py-4">
          <Separator />
        </div>

        <div className="flex flex-col gap-4 mb-8 items-center md:w-1/2 mx-auto px-4 md:px-0 w-full">
          <div className="grid gap-2 w-full">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full justify-between">
            <Card className="grid gap-2 md:w-1/2 p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </Card>

            <Card className="grid gap-2 md:w-1/2 p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </Card>
          </div>

          <div className="grid gap-2 w-full">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-64" />
          </div>

          <Skeleton className="h-10 w-52" />
        </div>
      </div>
    </>
  );
}
