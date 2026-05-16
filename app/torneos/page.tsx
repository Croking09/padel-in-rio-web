import Torneos from "@/components/torneos/torneos";
import TorneosSkeleton from "@/components/torneos/torneos-skeleton";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth/auth-button";
import { Button } from "@/components/ui/button";
import CreateTorneoButton from "@/components/torneos/admin/create-torneo-button";
import { createClient } from "@/lib/supabase/server";

type SearchParams = {
  page?: string;
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 items-center mt-8 text-center md:text-left">
        <div />
        <h2 className="text-3xl font-bold text-center">NUESTROS TORNEOS</h2>
        <div className="flex justify-center md:justify-end md:pr-8 py-4 md:pt-0">
          <Suspense>
            <AuthButton />
          </Suspense>
        </div>
      </div>

      <Suspense
        fallback={
          <Button disabled className="w-full md:w-auto invisible">
            Crear torneo
          </Button>
        }
      >
        <AdminSection />
      </Suspense>

      <Suspense fallback={<TorneosSkeleton />}>
        <TorneosWrapper searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function AdminSection() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.app_metadata?.admin === true;

  if (!isAdmin) return null;

  return (
    <div className="px-8 pt-4 md:pt-0 flex justify-center md:justify-start">
      <CreateTorneoButton className="w-full md:w-auto" />
    </div>
  );
}

async function TorneosWrapper({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  return <Torneos page={page} />;
}
