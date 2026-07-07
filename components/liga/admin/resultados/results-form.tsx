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
import SetCard from "@/components/liga/partidos/set-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

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
    <div className="mx-auto pb-8 space-y-8 px-8">
      <Card className="mx-auto max-w-5xl overflow-hidden py-0 gap-0">
        <Collapsible>
          <CollapsibleTrigger
            render={
              <button
                type="button"
                className="group w-full text-left transition-colors"
              >
                <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
                  <CardTitle className="text-base font-semibold">
                    Participación
                  </CardTitle>

                  <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </CardHeader>
              </button>
            }
          />

          <CollapsibleContent>
            <CardContent className="space-y-3 px-4 py-4">
              {players.map((player, i) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="font-medium truncate">
                    {player.nickname || player.full_name}
                  </span>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm whitespace-nowrap">
                      <Checkbox
                        checked={participation[i].asiste}
                        onCheckedChange={(checked) =>
                          updateParticipation(i, "asiste", checked === true)
                        }
                      />
                      Asiste
                    </label>

                    {!participation[i].asiste && (
                      <Select
                        value={participation[i].sustituto_id?.toString() || ""}
                        onValueChange={(value) =>
                          updateParticipation(
                            i,
                            "sustituto_id",
                            value === "" ? null : Number(value),
                          )
                        }
                      >
                        <SelectTrigger size="sm" className="w-56">
                          <SelectValue placeholder="Selecciona un sustituto">
                            {(() => {
                              const sustitutoId = participation[i].sustituto_id;
                              if (!sustitutoId) return undefined;

                              const socioSustituto = allSocios.find(
                                (s) => s.id === sustitutoId,
                              );
                              return socioSustituto
                                ? socioSustituto.nickname ||
                                    socioSustituto.full_name
                                : undefined;
                            })()}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent alignItemWithTrigger={false}>
                          <SelectGroup>
                            {allSocios
                              .filter((p) => p.id !== player.id)
                              .map((p) => (
                                <SelectItem key={p.id} value={p.id.toString()}>
                                  {p.nickname || p.full_name}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {combos.map((combo, i) => (
          <SetCard
            key={i}
            title={`Set ${i + 1}`}
            team1={{
              players: [
                {
                  id: combo[0].id,
                  name: combo[0].nickname ?? combo[0].full_name,
                  absent: isAbsent(combo[0].id),
                },
                {
                  id: combo[1].id,
                  name: combo[1].nickname ?? combo[1].full_name,
                  absent: isAbsent(combo[1].id),
                },
              ],
              score: (
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  className="w-16 text-center"
                  value={results[i].p1}
                  onChange={(e) => updateScore(i, "p1", e.target.value)}
                />
              ),
            }}
            team2={{
              players: [
                {
                  id: combo[2].id,
                  name: combo[2].nickname ?? combo[2].full_name,
                  absent: isAbsent(combo[2].id),
                },
                {
                  id: combo[3].id,
                  name: combo[3].nickname ?? combo[3].full_name,
                  absent: isAbsent(combo[3].id),
                },
              ],
              score: (
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  className="w-16 text-center"
                  value={results[i].p2}
                  onChange={(e) => updateScore(i, "p2", e.target.value)}
                />
              ),
            }}
          />
        ))}
      </div>

      <Button onClick={handleSubmit} className="block mx-auto">
        Guardar resultados
      </Button>
    </div>
  );
}
