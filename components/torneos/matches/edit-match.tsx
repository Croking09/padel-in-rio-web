"use client";

import { useState } from "react";
import { PencilIcon } from "lucide-react";

import { updateMatch } from "@/app/actions/tournament-match-actions";

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
import { TournamentMatchRow } from "@/lib/types/tournament-match";

export default function EditMatch({
  tournament,
  match,
}: {
  tournament: TournamentRow;
  match: TournamentMatchRow;
}) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (data: MatchFormData) => {
    return await updateMatch(match.id, tournament.id, data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <PencilIcon />
            Editar
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Editar partido
          </DialogTitle>
        </DialogHeader>

        <MatchForm
          tournament={tournament}
          initialValues={match}
          submitLabel="Guardar cambios"
          onSubmit={handleSubmit}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
