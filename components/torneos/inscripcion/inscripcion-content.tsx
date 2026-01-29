import { getTorneoById } from "@/app/actions/torneos";
import { redirect } from "next/navigation";
import { AuthButton } from "@/components/auth/auth-button";
import Form from "@/components/torneos/inscripcion/form";

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

  if (!torneo || torneo.start_date < new Date().toISOString()) {
    redirect("/torneos");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Inscripción al torneo: {torneo.name}
      </h1>

      <div className="bg-muted/30 p-6 rounded-lg border">
        <p className="mb-4">
          Estás a punto de inscribirte al torneo <strong>{torneo.name}</strong>.
        </p>

        <p className="text-sm opacity-80 mb-6">
          Necesitas iniciar sesión para inscribirte.
        </p>

        <AuthButton />
        <Form torneo_id={torneo.id} />
      </div>
    </div>
  );
}
