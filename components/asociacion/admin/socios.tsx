import { getAllSocios } from "@/app/actions/socios";
import SociosClient from "./socios-client";

export default async function Socios() {
  const socios = await getAllSocios();
  return <SociosClient socios={socios ?? []} />;
}
