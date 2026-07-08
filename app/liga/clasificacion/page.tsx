import { getTemporadas } from "@/app/actions/ligas";
import { getGeneralClassification } from "@/app/actions/clasificacion";
import GeneralClassificationTable from "@/components/liga/clasificacion-general/general-table";
import { resolveTemporadaId } from "@/lib/liga/resolve-active-month";
import { cookies } from "next/headers";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { SearchX } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ temporadaId?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const [temporadas, params, cookieStore] = await Promise.all([
    getTemporadas(),
    searchParams,
    cookies(),
  ]);

  const activeTemporadaId = resolveTemporadaId(
    [params.temporadaId, cookieStore.get("temporadaId")?.value],
    temporadas,
  );

  const data = await getGeneralClassification(activeTemporadaId);

  return (
    <>
      <div className="flex flex-col items-center justify-center py-8 px-4 md:px-8 lg:px-24">
        <h1 className="text-4xl font-bold">Clasificación General</h1>
        <p className="text-muted-foreground">
          <span className="text-destructive">*</span> Solo se muestran jugadores
          que hayan jugado por lo menos un partido.
        </p>
      </div>

      <div className="flex justify-center pb-8 px-4 md:px-8 lg:px-24">
        {!data.length ? (
          <Empty className="border-2 border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchX />
              </EmptyMedia>
              <EmptyTitle>Sin datos</EmptyTitle>
              <EmptyDescription>
                No se encontraron datos para la temporada seleccionada.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <GeneralClassificationTable data={data} />
        )}
      </div>
    </>
  );
}
