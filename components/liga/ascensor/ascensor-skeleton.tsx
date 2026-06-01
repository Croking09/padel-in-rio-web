import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCategoryTable() {
  return (
    <div className="mb-8 rounded-xl overflow-hidden border border-border">
      <div className="bg-primary px-4 py-3 border-b border-border">
        <Skeleton className="h-6 w-32 rounded" />
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-primary/40 border-b border-border">
            <th className="w-10 py-2.5 px-3 text-center text-xs font-semibold uppercase">
              <Skeleton className="h-4 w-4 mx-auto rounded" />
            </th>
            <th className="py-2.5 px-3 text-left text-xs font-semibold uppercase">
              <Skeleton className="h-4 w-28 rounded" />
            </th>
            <th className="w-14 py-2.5 px-3 text-center text-xs font-semibold uppercase">
              <Skeleton className="h-4 w-8 mx-auto rounded" />
            </th>
            <th className="w-14 py-2.5 px-3 text-center text-xs font-semibold uppercase">
              <Skeleton className="h-4 w-8 mx-auto rounded" />
            </th>
            <th className="w-14 py-2.5 px-3 text-center text-xs font-semibold uppercase">
              <Skeleton className="h-4 w-8 mx-auto rounded" />
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <tr
              key={i}
              className={`${i % 2 === 0 ? "bg-primary/20" : "bg-background"}`}
            >
              <td className="py-2.5 px-3 text-center">
                <Skeleton className="h-6 w-6 mx-auto rounded" />
              </td>
              <td className="py-2.5 px-3">
                <Skeleton className="h-6 w-36 rounded" />
              </td>
              <td className="py-2.5 px-3 text-center">
                <Skeleton className="h-6 w-10 mx-auto rounded" />
              </td>
              <td className="py-2.5 px-3 text-center">
                <Skeleton className="h-6 w-10 mx-auto rounded" />
              </td>
              <td className="py-2.5 px-3 text-center">
                <Skeleton className="h-6 w-10 mx-auto rounded" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
