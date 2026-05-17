import { getTemporadasWithMonths } from "@/app/actions/ligas";
import TemporadasClient from "@/components/liga/admin/temporadas/temporadas-client";

export default async function Page() {
  // Tu fetch de datos aquí
  const temporadas = await getTemporadasWithMonths();

  return (
    <>
      <h1 className="text-3xl font-bold text-center my-8">Temporadas</h1>
      <TemporadasClient temporadas={temporadas} />
    </>
  );
}
