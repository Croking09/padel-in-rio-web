"use client";

import DataTable from "@/components/ui/data-table";
import CreateMember from "@/components/asociacion/admin/create-member";
import type { MemberRow } from "@/lib/types/member";
import { columns } from "@/components/asociacion/admin/members-table/columns";

export default function MembersTable({
  className,
  members,
}: {
  className: string;
  members: MemberRow[];
}) {
  return (
    <DataTable
      className={className}
      columns={columns}
      data={members}
      searchPlaceholder="Buscar socio..."
      globalFilterFn={(member: MemberRow, search) => {
        const fullName = member.full_name?.toLowerCase() ?? "";
        const nickname = member.nickname?.toLowerCase() ?? "";
        return fullName.includes(search) || nickname.includes(search);
      }}
      toolbarActions={<CreateMember />}
    />
  );
}
