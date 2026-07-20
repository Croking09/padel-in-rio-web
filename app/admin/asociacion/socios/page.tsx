import { Suspense } from "react";
import MemberTableSkeleton from "@/components/asociacion/admin/members-table/member-table-skeleton";
import { getAllMembers } from "@/app/actions/member-actions";
import MembersTable from "@/components/asociacion/admin/members-table/members-table";

export default async function Page() {
  const members = await getAllMembers();

  return (
    <>
      <h1 className="text-4xl font-bold text-center pt-8">Socios</h1>
      <Suspense fallback={<MemberTableSkeleton />}>
        <div className="px-4">
          <MembersTable
            className="container mx-auto px-4 my-8"
            members={members}
          />
        </div>
      </Suspense>
    </>
  );
}
