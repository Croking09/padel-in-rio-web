import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <h1 className="text-4xl font-bold text-center pt-8 px-8">
        Normativa de la Liga
      </h1>

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="mt-1 h-5 w-5 shrink-0 rounded-full" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[95%]" />
              {i === 6 || i === 11 ? (
                <>
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[75%]" />
                </>
              ) : (
                <Skeleton className="h-4 w-[75%]" />
              )}

              {i === 11 && (
                <div className="mt-4 ml-6 space-y-3">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <div key={j} className="flex gap-3">
                      <Skeleton className="mt-1 h-4 w-4 shrink-0 rounded-full" />
                      <Skeleton className="h-4 w-[60%]" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
