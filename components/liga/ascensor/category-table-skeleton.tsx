import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export default function CategoryTableSkeleton() {
  return (
    <Card className="overflow-hidden py-0 gap-0">
      <CardHeader className="px-4 py-3">
        <Skeleton className="h-6 w-16" />
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 text-center text-xs text-muted-foreground">
                #
              </TableHead>
              <TableHead className="text-xs">JUGADOR</TableHead>
              <TableHead className="w-14 text-center text-xs text-muted-foreground">
                PTS
              </TableHead>
              <TableHead className="w-14 text-center text-xs text-muted-foreground">
                DIF
              </TableHead>
              <TableHead className="w-14 text-center text-xs text-muted-foreground">
                JG
              </TableHead>
              <TableHead className="w-14 text-center text-xs text-muted-foreground">
                PJ
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="text-center">
                  <Skeleton className="mx-auto h-4 w-4" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-32 max-w-full" />
                </TableCell>

                <TableCell className="text-center">
                  <Skeleton className="mx-auto h-4 w-6" />
                </TableCell>

                <TableCell className="text-center">
                  <Skeleton className="mx-auto h-4 w-8" />
                </TableCell>

                <TableCell className="text-center">
                  <Skeleton className="mx-auto h-4 w-6" />
                </TableCell>

                <TableCell className="text-center">
                  <Skeleton className="mx-auto h-4 w-6" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
