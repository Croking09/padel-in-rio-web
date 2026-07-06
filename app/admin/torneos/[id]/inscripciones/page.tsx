import { getInscripcionesByTorneo } from "@/app/actions/inscripciones";
import { getTorneoById } from "@/app/actions/torneos";
import { formatDate } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await new Promise((r) => setTimeout(r, 5000));

  const { id } = await params;

  const [{ data: inscripciones }, torneo] = await Promise.all([
    getInscripcionesByTorneo(id),
    getTorneoById(id),
  ]);

  if (!torneo) {
    return <p className="p-8 text-center">Torneo no encontrado.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-center text-4xl font-bold">{torneo.name}</h1>

      <div className="mt-4 space-y-4">
        {torneo.description && (
          <p className="mx-auto text-center text-muted-foreground">
            {torneo.description}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-xs font-medium text-muted-foreground">Inicio</p>
            <p className="font-semibold">{formatDate(torneo.start_date)}</p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-xs font-medium text-muted-foreground">Fin</p>
            <p className="font-semibold">{formatDate(torneo.end_date)}</p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Cierre de inscripciones
            </p>
            <p className="font-semibold">
              {formatDate(torneo.inscription_end_date)}
            </p>
          </div>
        </div>

        {torneo.manually_closed && (
          <p className="text-center font-medium text-destructive">
            Inscripciones cerradas manualmente
          </p>
        )}
      </div>

      <div className="py-8">
        <Separator />
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Inscripciones ({inscripciones?.length ?? 0})
        </h2>

        {!inscripciones?.length ? (
          <p className="text-muted-foreground">No hay inscripciones todavía.</p>
        ) : (
          <div className="overflow-hidden rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jugador 1</TableHead>
                  <TableHead>Jugador 2</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Categoría</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {inscripciones.map((inscripcion) => (
                  <TableRow key={inscripcion.id}>
                    <TableCell className="font-medium">
                      {inscripcion.player_1_full_name}
                    </TableCell>

                    <TableCell>{inscripcion.player_2_full_name}</TableCell>

                    <TableCell>{inscripcion.phone_number}</TableCell>

                    <TableCell>{inscripcion.category ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
}
