import InscripcionContent from "@/components/torneos/inscripcion/inscripcion-content";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <InscripcionContent id={id} />;
}
