import { getTemporadasWithMonths } from "@/app/actions/ligas";
import CreateTemporadaButton from "@/components/liga/admin/temporadas/create-temporada-button";
import TemporadasClient from "@/components/liga/admin/temporadas/temporadas-client";

export default async function Page() {
  const temporadas = await getTemporadasWithMonths();

  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-3 items-center py-8 px-4 md:px-8 lg:px-24">
        <div />

        <h1 className="text-4xl font-bold text-center pb-4 md:pb-0">
          Temporadas
        </h1>

        <div className="justify-self-end">
          <CreateTemporadaButton />
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-24 pb-8">
        <TemporadasClient temporadas={temporadas} />
      </div>
    </>
  );
}
