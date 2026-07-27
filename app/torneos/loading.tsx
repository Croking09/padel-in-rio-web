import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex flex-col items-center gap-4 px-8 pt-8 md:grid md:grid-cols-3">
        <div className="hidden md:block" />
        <h1 className="text-4xl font-bold text-center">Nuestros Torneos</h1>
        <div className="hidden md:block" />
      </div>

      <ul className="grid grid-cols-1 gap-16 p-8 md:grid-cols-2 md:gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <li
            key={index}
            className="flex flex-col gap-4 overflow-hidden lg:flex-row"
          >
            <Skeleton className="h-130 w-full shrink-0 md:h-90 md:w-70" />

            <div className="flex w-full flex-col lg:p-4">
              <Skeleton className="mb-3 h-8 w-3/5" />
              <Skeleton className="mb-2 h-4 w-2/5" />

              <div className="space-y-2 py-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              <div className="mt-4 flex w-full max-w-50 flex-col gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
