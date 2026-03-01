import { getAllSocios } from "@/app/actions/socios";
import SociosClient from "./socios-client";

export default async function Socios() {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const socios = await getAllSocios();
  return <SociosClient socios={socios ?? []} />;
}
