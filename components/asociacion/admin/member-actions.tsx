"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon, Pencil } from "lucide-react";
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
import { MemberRow } from "@/lib/types/member";
import { editMember, toggleActiveMember } from "@/app/actions/member-actions";
import { toast } from "sonner";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

export function MemberActions({ member }: { member: MemberRow }) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState(member.full_name);
  const [nickname, setNickname] = useState(member.nickname ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setFullName(member.full_name);
      setNickname(member.nickname ?? "");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    const result = await editMember(member.id, {
      full_name: fullName,
      nickname: nickname || null,
    });

    setIsSaving(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Socio actualizado correctamente.");
    setOpen(false);
  }

  async function handleToggle() {
    const result = await toggleActiveMember(member.id, !member.is_active);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(
      `Socio ${member.is_active ? "desactivado" : "activado"} correctamente.`,
    );

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
            <Field>
              <FieldLabel htmlFor="full_name">
                Nombre completo <span className="text-destructive">*</span>
              </FieldLabel>
              <FieldContent>
                <Input
                  id="full_name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="nickname">Apodo</FieldLabel>
              <FieldContent>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </FieldContent>
            </Field>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
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
              variant={member.is_active ? "destructive" : "secondary"}
              size="icon"
              className="rounded-full"
            >
              {member.is_active ? (
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
              {member.is_active ? "¿Desactivar socio?" : "¿Activar socio?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {member.is_active ? (
                <>
                  <span className="underline">{member.full_name}</span> dejará
                  de aparecer como socio activo.
                </>
              ) : (
                <>
                  <span className="underline">{member.full_name}</span> volverá
                  a aparecer como socio activo.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleToggle}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
