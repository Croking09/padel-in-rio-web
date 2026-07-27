"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { createMatch } from "@/app/actions/tournament-match-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import MatchForm, { MatchFormData } from "./match-form";

import { TournamentRow } from "@/lib/types/tournament";

export default function CreateMatch({
  tournament,
}: {
  tournament: TournamentRow;
}) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: MatchFormData) => {
    return await createMatch({
      ...data,
      tournament_id: tournament.id,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <PlusIcon />
            Crear partido
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Nuevo partido
          </DialogTitle>
        </DialogHeader>

        <MatchForm
          tournament={tournament}
          submitLabel="Crear"
          onSubmit={handleSubmit}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
