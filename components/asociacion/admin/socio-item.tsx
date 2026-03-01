"use client";

import { useState } from "react";
import { Socio } from "@/lib/types/socio";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDownIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { toggleActiveSocio, editSocio } from "@/app/actions/socios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function SocioItem({ socio }: { socio: Socio }) {
  const [fullName, setFullName] = useState(socio.full_name);
  const [nickname, setNickname] = useState(socio.nickname ?? "");

  const handleReset = () => {
    setFullName(socio.full_name);
    setNickname(socio.nickname ?? "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = await editSocio(socio.id, {
      full_name: fullName,
      nickname,
    });

    if (error) {
      toast.error(error.error, {
        position: "top-center",
      });
    } else {
      toast.success("Socio editado correctamente", {
        position: "top-center",
      });
    }
  };

  const toggleDeactivate = async () => {
    const error = await toggleActiveSocio(socio.id, socio.active);

    if (error) {
      toast.error(error.error, {
        position: "top-center",
      });
    } else {
      const text = socio.active ? "desactivado" : "activado";
      toast.success(`Socio ${text} correctamente`, {
        position: "top-center",
      });
    }
  };

  return (
    <Card className="mx-auto w-full">
      <CardContent>
        <Collapsible className="rounded-md">
          <div className="flex items-center justify-between pt-6 relative">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{socio.full_name}</span>
              <span className="text-sm opacity-70">{socio.nickname}</span>
            </div>

            <div className="absolute left-[60%] translate-x-[-50%]">
              {socio.active ? (
                <Badge variant="secondary">Activo</Badge>
              ) : (
                <Badge variant="default">Inactivo</Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/70 rounded-full"
                onClick={toggleDeactivate}
              >
                {socio.active ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </Button>

              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="group hover:bg-primary/70 rounded-full"
                >
                  <ChevronDownIcon className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent className="flex flex-col gap-4 pt-6">
            <hr />
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs">Nombre completo</label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs">Nickname</label>
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  className="hover:underline"
                  type="button"
                  variant="ghost"
                  onClick={handleReset}
                >
                  Descartar
                </Button>

                <Button type="submit">Guardar cambios</Button>
              </div>
            </form>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
