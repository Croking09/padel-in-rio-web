import { getTorneoById } from "@/app/actions/torneos";
import { redirect } from "next/navigation";
import Form from "@/components/torneos/inscripcion/form";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    redirect("/torneos");
  }

  const torneo = await getTorneoById(id);

  if (
    !torneo ||
    new Date(torneo.start_date) < new Date() ||
    new Date(torneo.inscription_end_date) < new Date() ||
    torneo.manually_closed
  ) {
    redirect("/torneos");
  }

  return (
    <>
      <h1 className="py-8 text-center text-4xl font-bold">
        Inscripción para: {torneo.name}
      </h1>

      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <p>
            Solo <strong className="underline">una</strong> persona por pareja
            debe inscribirse.
          </p>

          <p className="text-sm">
            El plazo termina el{" "}
            <strong className="underline">
              {formatDate(torneo.inscription_end_date)}
            </strong>
            .
          </p>
        </div>

        <div className="mx-auto w-2/3 py-4">
          <Separator />
        </div>

        <Form torneoId={torneo.id} categories={torneo.categories} />
      </div>
    </>
  );
}
