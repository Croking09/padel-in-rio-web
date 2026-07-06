"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Socio } from "@/lib/types/socio";
import { SocioActions } from "@/components/asociacion/admin/socios-actions";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Socio>[] = [
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
    accessorKey: "active",
    header: "Estado",
    size: 100,
    cell: ({ row }) => {
      const socio = row.original;

      return (
        <>
          {socio.active ? (
            <Badge>Activo</Badge>
          ) : (
            <Badge variant="secondary">Inactivo</Badge>
          )}
        </>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    size: 150,
    cell: ({ row }) => <SocioActions socio={row.original} />,
  },
];
