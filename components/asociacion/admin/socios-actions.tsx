"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon, Pencil } from "lucide-react";
import { Socio } from "@/lib/types/socio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toggleActiveSocio, editSocio } from "@/app/actions/socios";

export function SocioActions({ socio }: { socio: Socio }) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState(socio.full_name);
  const [nickname, setNickname] = useState(socio.nickname ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setFullName(socio.full_name);
      setNickname(socio.nickname ?? "");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    await editSocio(socio.id, {
      full_name: fullName,
      nickname: nickname || null,
    });

    setOpen(false);
    setIsSaving(false);
  }

  function handleToggle() {
    toggleActiveSocio(socio.id, socio.active);
    setAlertOpen(false);
  }

  return (
    <div className="flex gap-2">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger
          render={
            <Button variant="secondary" size="icon" className="rounded-full">
              <Pencil className="h-4 w-4" />
            </Button>
          }
        ></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar socio</DialogTitle>
            <DialogDescription>
              Modifica el nombre completo o el apodo del socio.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre completo</Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname">Apodo</Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogTrigger
          render={
            <Button
              variant={socio.active ? "destructive" : "secondary"}
              size="icon"
              className="rounded-full"
            >
              {socio.active ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {socio.active ? "¿Desactivar socio?" : "¿Activar socio?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {socio.active ? (
                <>
                  <span className="underline">{socio.full_name}</span> dejará de
                  aparecer como socio activo.
                </>
              ) : (
                <>
                  <span className="underline">{socio.full_name}</span> volverá a
                  aparecer como socio activo.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggle}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
