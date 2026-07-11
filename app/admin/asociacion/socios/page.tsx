import { getAllSocios } from "@/app/actions/socios";
import DataTable from "@/components/asociacion/admin/socios-table/data-table";
import { columns } from "@/components/asociacion/admin/socios-table/columns";
import { Suspense } from "react";
import SociosTableSkeleton from "@/components/asociacion/admin/socios-table/socios-table-skeleton";

export default async function Page() {
  const socios = await getAllSocios();

  return (
    <>
      <h1 className="text-4xl font-bold text-center pt-8">Socios</h1>
      <Suspense fallback={<SociosTableSkeleton />}>
        <div className="px-4">
          <DataTable
            className="container mx-auto px-4 my-8"
            columns={columns}
            data={socios ?? []}
          />
        </div>
      </Suspense>
    </>
  );
}
