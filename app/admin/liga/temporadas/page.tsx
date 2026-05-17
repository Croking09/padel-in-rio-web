import { getTemporadasWithMonths } from "@/app/actions/ligas";
import CreateTemporadaButton from "@/components/liga/admin/temporadas/create-temporada-button";
import TemporadasClient from "@/components/liga/admin/temporadas/temporadas-client";

export default async function Page() {
  // Tu fetch de datos aquí
  const temporadas = await getTemporadasWithMonths();

  return (
    <div className="mx-auto w-full max-w-[40%] pb-8">
      <div className="flex justify-between items-center my-8">
        <h1 className="text-3xl font-bold">Temporadas</h1>
        <CreateTemporadaButton />
      </div>

      <TemporadasClient temporadas={temporadas} />
    </div>
  );
}
