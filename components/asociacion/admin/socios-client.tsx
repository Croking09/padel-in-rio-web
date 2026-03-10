"use client";

import { useMemo, useState } from "react";
import SocioItem from "./socio-item";
import CreateSocioButton from "./create-socio-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Socio } from "@/lib/types/socio";

export default function SociosClient({ socios }: { socios: Socio[] }) {
  const [search, setSearch] = useState("");

  const filteredSocios = useMemo(() => {
    const text = search.toLowerCase();

    return socios
      .filter(
        (socio) =>
          socio.full_name.toLowerCase().includes(text) ||
          socio.nickname?.toLowerCase().includes(text),
      )
      .sort((a, b) => {
        if (a.active === b.active) return 0;
        return a.active ? -1 : 1;
      });
  }, [search, socios]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 mb-4 mt-8 px-4">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
        <div className="flex w-full">
          <Input
            placeholder="Buscar socio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-tr-none rounded-br-none"
          />

          <Button
            variant="secondary"
            className="rounded-tl-none rounded-bl-none"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <CreateSocioButton />
      </div>

      <div className="flex flex-col gap-4 custom-scroll-container custom-scroll md:overflow-y-scroll md:h-[65vh]">
        {filteredSocios.length > 0 ? (
          filteredSocios.map((socio) => (
            <SocioItem key={socio.id} socio={socio} />
          ))
        ) : (
          <div className="text-sm text-center py-8">
            No se encontraron socios
          </div>
        )}
      </div>
    </div>
  );
}
