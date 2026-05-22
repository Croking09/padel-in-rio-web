import { getAllSocios } from "@/app/actions/socios";
import { getMonths } from "@/app/actions/ligas";
import HistoricoClient from "@/components/asociacion/historico/historico-client";

export default async function Page() {
  const [socios, months] = await Promise.all([getAllSocios(true), getMonths()]);

  return <HistoricoClient socios={socios ?? []} months={months} />;
}
