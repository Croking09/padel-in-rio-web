import { getTorneoById } from "@/app/actions/torneos";
import { redirect } from "next/navigation";
import { AuthButton } from "@/components/auth/auth-button";
import Form from "@/components/torneos/inscripcion/form";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function InscripcionContent({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

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

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <>
      <h2 className="text-center text-4xl font-bold my-8">
        Inscripción para: {torneo.name}
      </h2>

      <div className="flex flex-col gap-4 items-center">
        <div className="flex flex-col md:flex-row gap-2 items-center">
          {!user && <p>Necesitas iniciar sesión para inscribirte.</p>}
          <AuthButton />
        </div>
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

        <hr className="border-border w-2/3 mx-auto" />

        <Form torneo_id={torneo.id} categories={torneo.categories} />
      </div>
    </>
  );
}
