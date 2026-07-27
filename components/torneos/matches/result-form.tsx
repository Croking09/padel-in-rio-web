"use client";

import { useState, useTransition } from "react";
import { MinusIcon, PlusIcon, TrophyIcon } from "lucide-react";
import { toast } from "sonner";

import { updateMatch } from "@/app/actions/tournament-match-actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function ResultForm({
  matchId,
  tournamentId,
  pair1,
  pair2,
}: {
  matchId: number;
  tournamentId: number;
  pair1: string[];
  pair2: string[];
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [result, setResult] = useState<number[][]>([[0, 0]]);

  const updateScore = (setIndex: number, pairIndex: 0 | 1, value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 2);

    const next = [...result];
    next[setIndex][pairIndex] = digits === "" ? 0 : Number(digits);

    setResult(next);
  };

  const addSet = () => {
    setResult((prev) => [...prev, [0, 0]]);
  };

  const removeSet = (index: number) => {
    setResult((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setResult([[0, 0]]);
  };

  const handleAccept = () => {
    startTransition(async () => {
      const response = await updateMatch(matchId, tournamentId, {
        result,
      });

      if (!response.success) {
        toast.error(response.error);
        return;
      }

      toast.success("Resultado guardado con éxito");
      resetForm();
      setOpen(false);
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value) {
          resetForm();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <TrophyIcon />
            Añadir resultado
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Resultado del partido
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start justify-center gap-3 text-center">
            <span>{pair1.join(" / ")}</span>
            <span className="text-muted-foreground">vs</span>
            <span>{pair2.join(" / ")}</span>
          </div>

          <div className="space-y-2">
            {result.map((_, index) => (
              <div
                key={index}
                className="flex items-center rounded-lg border p-4"
              >
                <span className="text-sm font-medium text-muted-foreground">
                  Set {index + 1}
                </span>

                <div className="mx-auto flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={99}
                    placeholder="0"
                    onChange={(e) => updateScore(index, 0, e.target.value)}
                    className="w-16 text-center tabular-nums"
                  />

                  <span className="text-muted-foreground">-</span>

                  <Input
                    type="number"
                    min={0}
                    max={99}
                    placeholder="0"
                    onChange={(e) => updateScore(index, 1, e.target.value)}
                    className="w-16 text-center tabular-nums"
                  />
                </div>

                <div className="flex justify-end">
                  {result.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeSet(index)}
                      disabled={isPending}
                    >
                      <MinusIcon />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={addSet}
            disabled={isPending}
          >
            <PlusIcon />
            Añadir set
          </Button>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>

          <Button type="button" onClick={handleAccept} disabled={isPending}>
            {isPending ? "Guardando..." : "Aceptar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
