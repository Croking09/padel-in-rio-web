import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { CalendarX } from "lucide-react";

export default function EmptyMonths() {
  return (
    <Empty className="border-2 border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CalendarX />
        </EmptyMedia>
        <EmptyTitle>No hay meses para mostrar</EmptyTitle>
        <EmptyDescription>
          Todavía no se ha confirmado ningún mes de esta temporada.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
