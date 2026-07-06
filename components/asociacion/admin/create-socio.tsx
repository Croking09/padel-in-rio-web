"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { createSocio } from "@/app/actions/socios";
import { Label } from "@/components/ui/label";

export default function CreateSocio() {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = await createSocio({
      full_name: fullName,
      nickname: nickname || null,
    });

    if (error) {
      toast.error(error.error, { position: "top-center" });
      return;
    }

    toast.success("Socio creado correctamente!", { position: "top-center" });
    setFullName("");
    setNickname("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <PlusIcon className="h-4 w-4" />
            Añadir socio
          </Button>
        }
      ></DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Añadir nuevo socio
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label>
              Nombre completo<span className="text-destructive">*</span>
            </Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Apodo</Label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Crear</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
