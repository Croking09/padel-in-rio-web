import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <h1 className="text-4xl font-bold text-center pt-8 px-8">
        Política de Cookies
      </h1>

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-12">
        {Array.from({ length: 5 }).map((_, i) => (
          <section key={i} className="space-y-4">
            <Skeleton className="h-8 w-64" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[96%]" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[75%]" />
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
