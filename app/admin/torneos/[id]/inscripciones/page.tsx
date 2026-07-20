import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { getInscriptionsByTournament } from "@/app/actions/inscription-actions";
import { getTournamentById } from "@/app/actions/tournament-actions";
import { format, parseISO } from "date-fns";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tournamentId = Number(id);

  const [result, tournament] = await Promise.all([
    getInscriptionsByTournament(tournamentId),
    getTournamentById(tournamentId),
  ]);

  if (!tournament) {
    return <p className="p-8 text-center">Torneo no encontrado.</p>;
  }

  if (!result.success) {
    return (
      <p className="p-8 text-center">
        Se ha producido un error obteniendo las inscripciones
      </p>
    );
  }

  const inscriptions = result.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-center text-4xl font-bold">{tournament.name}</h1>

      <div className="mt-4 space-y-4">
        {tournament.description && (
          <p className="mx-auto text-center text-muted-foreground">
            {tournament.description}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="rounded-lg border p-4">
            <p className="text-sm font-medium text-muted-foreground">Inicio</p>
            <p className="font-semibold">
              {format(parseISO(tournament.start_date), "dd/MM/yyyy")}
            </p>
          </Card>

          <Card className="rounded-lg border p-4">
            <p className="text-sm font-medium text-muted-foreground">Fin</p>
            <p className="font-semibold">
              {format(parseISO(tournament.end_date), "dd/MM/yyyy")}
            </p>
          </Card>

          <Card className="rounded-lg border p-4">
            <p className="text-sm font-medium text-muted-foreground">
              Cierre de inscripciones
            </p>
            <p className="font-semibold">
              {format(parseISO(tournament.inscription_end_date), "dd/MM/yyyy")}
            </p>
          </Card>
        </div>

        {tournament.manually_closed && (
          <p className="text-center font-medium text-destructive pt-4">
            Inscripciones cerradas manualmente
          </p>
        )}
      </div>

      <div className="py-8">
        <Separator />
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Inscripciones ({inscriptions?.length ?? 0})
        </h2>

        {!inscriptions?.length ? (
          <p className="text-muted-foreground">No hay inscripciones todavía.</p>
        ) : (
          <div className="overflow-hidden rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="*:font-bold">
                  <TableHead>Jugador 1</TableHead>
                  <TableHead>Jugador 2</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Categoría</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {inscriptions.map((inscription) => (
                  <TableRow key={inscription.id}>
                    <TableCell className="font-medium">
                      {inscription.player1_full_name}
                    </TableCell>

                    <TableCell>{inscription.player2_full_name}</TableCell>

                    <TableCell>{inscription.phone_number}</TableCell>

                    <TableCell>{inscription.category ?? "-"}</TableCell>
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
