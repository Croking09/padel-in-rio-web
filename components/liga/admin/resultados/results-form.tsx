"use client";

import { useState } from "react";
import { registerMatchResults } from "@/app/actions/partidos";
import { redirect } from "next/navigation";
import { Socio } from "@/lib/types/socio";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import MatchParticipants from "@/lib/types/matchParticipants";
import { getMatchSetCombos } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function MatchResultsPage({
  partidoId,
  players,
  allSocios,
}: {
  partidoId: number;
  players: Omit<Socio, "active">[];
  allSocios: Socio[];
}) {
  const [results, setResults] = useState([
    { p1: "", p2: "" },
    { p1: "", p2: "" },
    { p1: "", p2: "" },
  ]);

  const [participation, setParticipation] = useState(
    players.map((p) => ({
      jugador_id: p.id,
      asiste: true,
      sustituto_id: null as number | null,
    })),
  );

  if (players.length !== 4) {
    redirect("/liga/partidos");
  }

  const combos = getMatchSetCombos(players);

  function updateScore(i: number, side: "p1" | "p2", value: string) {
    if (value !== "" && !/^\d+$/.test(value)) return;
    const copy = [...results];
    copy[i][side] = value;
    setResults(copy);
  }

  function updateParticipation(
    index: number,
    field: "asiste" | "sustituto_id",
    value: boolean | number | null,
  ) {
    const copy = [...participation];

    if (field === "asiste") {
      copy[index].asiste = value as boolean;

      if (!value) {
        copy[index].sustituto_id = null;
      }
    }

    if (field === "sustituto_id") {
      copy[index].sustituto_id = value as number;
    }

    setParticipation(copy);
  }

  async function handleSubmit() {
    if (results.some((r) => r.p1 === "" || r.p2 === "")) {
      toast.error("No se han introducido todos los resultados");
      return;
    }

    if (participation.some((p) => !p.asiste && p.sustituto_id === null)) {
      toast.error(
        "Debes seleccionar un sustituto para todos los jugadores ausentes",
      );
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

    const participacion: MatchParticipants[] = participation.map((p) => ({
      jugador_id: p.jugador_id,
      sustituto_id: p.asiste ? null : p.sustituto_id,
    }));

    const result = await registerMatchResults(partidoId, sets, participacion);

    if (!result.success) {
      return toast.error("Ha ocurrido un error al registrar los resultados");
    }

    toast.success("Resultados registrados correctamente");

    redirect("/liga/partidos");
  }

  function isAbsent(playerId: number) {
    return participation.some((p) => p.jugador_id === playerId && !p.asiste);
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold text-center">Registrar resultados</h1>

      <div className="max-w-5xl mx-auto select-none">
        <details className="border rounded-xl overflow-hidden">
          <summary className="cursor-pointer px-4 py-2 text-sm font-semibold">
            Participación
          </summary>

          <div className="px-4 py-2 space-y-2">
            {players.map((player, i) => (
              <div
                key={player.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-medium truncate w-40">
                  {player.nickname || player.full_name}
                </span>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <Input
                      type="checkbox"
                      checked={participation[i].asiste}
                      onChange={(e) =>
                        updateParticipation(i, "asiste", e.target.checked)
                      }
                    />
                    <span>Asiste</span>
                  </label>

                  {!participation[i].asiste && (
                    <select
                      className="border rounded-md px-2 py-1 text-sm bg-background"
                      value={participation[i].sustituto_id ?? ""}
                      onChange={(e) =>
                        updateParticipation(
                          i,
                          "sustituto_id",
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                    >
                      {" "}
                      <option value="">Sin sustituto</option>{" "}
                      {allSocios
                        .filter((p) => p.id !== player.id)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {" "}
                            {p.nickname || p.full_name}{" "}
                          </option>
                        ))}{" "}
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </details>
      </div>

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
                  <span
                    className={`font-semibold ${
                      isAbsent(combo[0].id) ? "line-through opacity-50" : ""
                    }`}
                  >
                    {combo[0].nickname || combo[0].full_name}
                  </span>
                  <span
                    className={`font-semibold ${
                      isAbsent(combo[1].id) ? "line-through opacity-50" : ""
                    }`}
                  >
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
                  <span
                    className={`font-semibold ${
                      isAbsent(combo[2].id) ? "line-through opacity-50" : ""
                    }`}
                  >
                    {combo[2].nickname || combo[2].full_name}
                  </span>
                  <span
                    className={`font-semibold ${
                      isAbsent(combo[3].id) ? "line-through opacity-50" : ""
                    }`}
                  >
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

      <Button
        variant="secondary"
        onClick={handleSubmit}
        className="block mx-auto"
      >
        Guardar resultados
      </Button>
    </div>
  );
}
