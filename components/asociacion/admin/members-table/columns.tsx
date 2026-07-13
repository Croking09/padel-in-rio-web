"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MemberActions } from "@/components/asociacion/admin/member-actions";
import { Badge } from "@/components/ui/badge";
import type { MemberRow } from "@/lib/types/member";

export const columns: ColumnDef<MemberRow>[] = [
  {
    accessorKey: "full_name",
    header: "Nombre completo",
    size: 250,
  },
  {
    accessorKey: "nickname",
    header: "Apodo",
    size: 150,
    cell: ({ row }) => row.getValue("nickname") ?? "-",
  },
  {
    accessorKey: "is_active",
    header: "Estado",
    size: 100,
    cell: ({ row }) => {
      const member = row.original;

      return member.is_active ? (
        <Badge>Activo</Badge>
      ) : (
        <Badge variant="secondary">Inactivo</Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    size: 150,
    cell: ({ row }) => <MemberActions member={row.original} />,
  },
];
