import { getAllSocios } from "@/app/actions/socios";
import { getMonths } from "@/app/actions/ligas";
import HistoricoClient from "@/components/asociacion/historico/historico-client";
import HistoricoSkeleton from "@/components/asociacion/historico/historico-skeleton";
import { Suspense } from "react";

async function Historico() {
  const [socios, months] = await Promise.all([getAllSocios(true), getMonths()]);

  return <HistoricoClient socios={socios ?? []} months={months} />;
}

export default function Page() {
  return (
    <Suspense fallback={<HistoricoSkeleton />}>
      <Historico />
    </Suspense>
  );
}
