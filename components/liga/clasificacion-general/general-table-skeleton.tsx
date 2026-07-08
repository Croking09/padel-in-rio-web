import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function GeneralClassificationTableSkeleton() {
  return (
    <div className="w-full md:w-xl rounded-xl overflow-hidden border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 text-center text-xs">#</TableHead>
            <TableHead className="text-xs">Jugador</TableHead>
            <TableHead className="w-20 text-center text-xs uppercase text-muted-foreground">
              Pts
            </TableHead>
            <TableHead className="w-20 text-center text-xs uppercase text-muted-foreground">
              Dif
            </TableHead>
            <TableHead className="w-20 text-center text-xs uppercase text-muted-foreground">
              JG
            </TableHead>
            <TableHead className="w-20 text-center text-xs uppercase text-muted-foreground">
              PJ
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 16 }).map((_, i) => (
            <TableRow
              key={i}
              className={i % 2 === 0 ? "bg-muted/50" : undefined}
            >
              <TableCell className="text-center">
                <Skeleton className="mx-auto h-4 w-4" />
              </TableCell>

              <TableCell>
                <Skeleton className="h-4 w-36 max-w-full" />
              </TableCell>

              <TableCell className="text-center">
                <Skeleton className="mx-auto h-4 w-8" />
              </TableCell>

              <TableCell className="text-center">
                <Skeleton className="mx-auto h-4 w-10" />
              </TableCell>

              <TableCell className="text-center">
                <Skeleton className="mx-auto h-4 w-8" />
              </TableCell>

              <TableCell className="text-center">
                <Skeleton className="mx-auto h-4 w-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
