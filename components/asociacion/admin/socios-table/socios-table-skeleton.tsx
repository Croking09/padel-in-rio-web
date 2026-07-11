import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SociosTableSkeleton() {
  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between py-4">
        <Skeleton className="h-9 max-w-xs w-full" />
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: 250 }}>
                <Skeleton className="h-4 w-32" />
              </TableHead>
              <TableHead style={{ width: 150 }}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead style={{ width: 100 }}>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead style={{ width: 100 }} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell style={{ width: 250 }}>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell style={{ width: 150 }}>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell style={{ width: 100 }}>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell style={{ width: 150 }}>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center space-x-2 py-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
