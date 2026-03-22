"use client";

import { useState } from "react";
import { registerMatchResults } from "@/app/actions/partidos";
import { redirect } from "next/navigation";
import { Socio } from "@/lib/types/socio";
import { HapticButton } from "@/components/ui/haptic-button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function MatchResultsPage({
  partidoId,
  players,
}: {
  partidoId: number;
  players: Omit<Socio, "active">[];
}) {
  const [results, setResults] = useState([
    { p1: "", p2: "" },
    { p1: "", p2: "" },
    { p1: "", p2: "" },
  ]);

  if (players.length !== 4) {
    redirect("/liga/partidos");
    return null;
  }

  const combos = [
    [players[0], players[2], players[1], players[3]],
    [players[0], players[1], players[2], players[3]],
    [players[0], players[3], players[1], players[2]],
  ];

  function updateScore(i: number, side: "p1" | "p2", value: string) {
    if (value !== "" && !/^\d+$/.test(value)) return;
    const copy = [...results];
    copy[i][side] = value;
    setResults(copy);
  }

  async function handleSubmit() {
    if (results.some((r) => r.p1 === "" && r.p2 === "")) {
      toast.error("No se han introducido todos los resultados", {
        position: "top-center",
      });
      return;
    }

    const sets = combos.map((c, i) => ({
      orden: i + 1,
      pareja1_jugador1_id: c[0].id,
      pareja1_jugador2_id: c[1].id,
      pareja2_jugador1_id: c[2].id,
      pareja2_jugador2_id: c[3].id,
      pareja1_juegos: Number(results[i].p1),
      pareja2_juegos: Number(results[i].p2),
    }));

    const result = await registerMatchResults(partidoId, sets);
    if (!result.success)
      return toast.error("Ha ocurrido un error al registrar los resultados", {
        position: "top-center",
      });
    else {
      toast.success("Resultados registrados correctamente", {
        position: "top-center",
      });
      redirect("/liga/partidos");
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold text-center">Registrar resultados</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {combos.map((combo, i) => (
          <div
            key={i}
            className="flex flex-col rounded-xl border overflow-hidden"
          >
            <div className="px-4 py-2 border-b">
              <h3 className="font-bold text-md">Set {i + 1}</h3>
            </div>

            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {combo[0].nickname || combo[0].full_name}
                  </span>
                  <span className="font-semibold">
                    {combo[1].nickname || combo[1].full_name}
                  </span>
                </div>

                <Input
                  type="text"
                  inputMode="numeric"
                  className="border p-2 w-16 rounded"
                  value={results[i].p1}
                  placeholder="0"
                  onChange={(e) => updateScore(i, "p1", e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="h-px bg-border flex-1" />
                <span className="text-xs font-bold">VS</span>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {combo[2].nickname || combo[2].full_name}
                  </span>
                  <span className="font-semibold">
                    {combo[3].nickname || combo[3].full_name}
                  </span>
                </div>

                <Input
                  type="text"
                  inputMode="numeric"
                  className="border p-2 w-16 rounded"
                  value={results[i].p2}
                  placeholder="0"
                  onChange={(e) => updateScore(i, "p2", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <HapticButton
        variant="secondary"
        onClick={handleSubmit}
        className="block mx-auto"
      >
        Guardar resultados
      </HapticButton>
    </div>
  );
}
