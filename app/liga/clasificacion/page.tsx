import { getTemporadas } from "@/app/actions/ligas";
import { getGeneralClassification } from "@/app/actions/clasificacion";
import { GeneralTable } from "@/components/liga/clasificacion-general/general-table";

interface PageProps {
  searchParams: Promise<{ temporadaId?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const [temporadas, params] = await Promise.all([
    getTemporadas(),
    searchParams,
  ]);

  const temporadaIdParam = params.temporadaId
    ? Number(params.temporadaId)
    : undefined;
  const activeTemporadaId = temporadaIdParam ?? temporadas.at(0)?.id ?? 0;

  const data = await getGeneralClassification(activeTemporadaId);

  return (
    <div className="max-w-[90%] mx-auto px-4 py-8 space-y-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold">Clasificación General</h1>

      {!data.length ? (
        <div className="text-center py-20 rounded-lg border-2 border-dashed">
          <p>No se encontraron datos para la temporada seleccionada.</p>
        </div>
      ) : (
        <>
          <p>
            <span className="text-red-500">*</span> Solo se muestran jugadores
            que hayan jugado por lo menos un partido.
          </p>
          <GeneralTable data={data} />
        </>
      )}
    </div>
  );
}
