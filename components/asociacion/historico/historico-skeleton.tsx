import { Skeleton } from "@/components/ui/skeleton";

export default function HistoricoSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="flex w-full">
        <Skeleton className="h-10 flex-1 rounded-r-none" />
        <Skeleton className="h-10 w-12 rounded-l-none" />
      </div>

      <div className="rounded-xl overflow-hidden border border-border">
        <div className="flex items-center justify-between gap-3 border-b border-border bg-primary/40 px-4 py-3">
          <div className="flex min-w-0 flex-col gap-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-24" />
          </div>

          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-2 text-left">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="w-32 px-4 py-2 text-center">
                <Skeleton className="h-4 w-20 mx-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-primary/10" : undefined}
              >
                <td className="px-4 py-3">
                  <Skeleton className="h-5 w-32" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Skeleton className="h-5 w-24 mx-auto rounded-full" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
