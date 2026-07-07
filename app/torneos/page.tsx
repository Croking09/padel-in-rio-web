import TorneosList from "@/components/torneos/torneos-list";
import { getTorneos } from "../actions/torneos";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth/permissions";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getMyInscripcionesOpenTorneos } from "../actions/inscripciones";

export default async function Page() {
  const supabase = await createClient();
  const [
    torneos,
    {
      data: { user },
    },
  ] = await Promise.all([getTorneos(), supabase.auth.getUser()]);

  const showAdminControls = isAdmin(user);

  const inscripciones = user
    ? await getMyInscripcionesOpenTorneos(user.id)
    : [];

  const registeredTorneoIds = new Set(inscripciones.map((i) => i.torneo_id));

  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-3 items-center gap-4 pt-8 px-8">
        <div className="hidden md:block" />
        <h1 className="text-4xl font-bold text-center">NUESTROS TORNEOS</h1>
        {showAdminControls ? (
          <Link
            href="/admin/torneos/create-torneo"
            className={buttonVariants({
              variant: "default",
              size: "default",
              className: "md:justify-self-end",
            })}
          >
            <PlusIcon className="h-4 w-4" />
            Crear torneo
          </Link>
        ) : (
          <div className="hidden md:block" />
        )}
      </div>

      <TorneosList
        torneos={torneos}
        registeredTorneosIds={registeredTorneoIds}
        showAdminControls={showAdminControls}
      />
    </>
  );
}
