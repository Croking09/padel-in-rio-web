import { Skeleton } from "@/components/ui/skeleton";

export default function SocioListSkeleton() {
  return (
    <div className="flex flex-col gap-4 mt-8 overflow-y-scroll h-[70vh]">
      <div className="flex items-center justify-between gap-4 w-full max-w-2xl mx-auto">
        <Skeleton className="h-10 flex-1 rounded-l-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      {[0, 1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="mx-auto w-full max-w-2xl rounded-md border p-4 shadow-card"
        >
          <div className="flex items-center justify-between relative pt-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="absolute left-[60%] translate-x-[-50%]">
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
