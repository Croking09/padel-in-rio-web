import { getInscripcionesByTorneo } from "@/app/actions/inscripciones";
import { getTorneoById } from "@/app/actions/torneos";
import { formatDate } from "@/lib/utils";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: inscripciones } = await getInscripcionesByTorneo(id);
  const torneo = await getTorneoById(id);

  if (!torneo) {
    return <p className="p-8">Torneo no encontrado</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <section className="space-y-2">
        <h2 className="text-4xl font-bold">{torneo.name}</h2>

        {torneo.description && <p>{torneo.description}</p>}

        <div className="text-sm space-y-1">
          <p>
            <strong>Inicio:</strong> {formatDate(torneo.start_date)}
          </p>
          <p>
            <strong>Fin:</strong> {formatDate(torneo.end_date)}
          </p>
          <p>
            <strong>Cierre inscripciones:</strong>{" "}
            {formatDate(torneo.inscription_end_date)}
          </p>

          {torneo.manually_closed && (
            <p className="text-error font-medium">
              Inscripciones cerradas manualmente
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          Inscripciones ({inscripciones?.length ?? 0})
        </h2>

        {!inscripciones?.length ? (
          <p>No hay inscripciones todavía.</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-3">Jugador 1</th>
                  <th className="text-left p-3">Jugador 2</th>
                  <th className="text-left p-3">Teléfono</th>
                  <th className="text-left p-3">Categoría</th>
                </tr>
              </thead>

              <tbody>
                {inscripciones.map((i) => (
                  <tr key={i.id} className="border-t">
                    <td className="p-3">{i.player_1_full_name}</td>
                    <td className="p-3">{i.player_2_full_name}</td>
                    <td className="p-3">{i.phone_number}</td>
                    <td className="p-3">{i.category ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
