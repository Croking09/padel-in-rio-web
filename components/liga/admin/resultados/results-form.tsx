"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
import { MemberRow, Player } from "@/lib/types/member";
import { registerMatchResults } from "@/app/actions/match-actions";
import { getMatchSetCombos } from "@/lib/liga/match";

export default function ResultsForm({
  matchId,
  players,
  members,
}: {
  matchId: number;
  players: Player[];
  members: MemberRow[];
}) {
  const [setScores, setSetScores] = useState([
    { pair1: "", pair2: "" },
    { pair1: "", pair2: "" },
    { pair1: "", pair2: "" },
  ]);

  const [playerParticipation, setPlayerParticipation] = useState(
    players.map((player) => ({
      playerId: player.id,
      attends: true,
      substituteId: null as number | null,
    })),
  );

  if (players.length !== 4) {
    redirect("/liga/partidos");
  }
  const setPairings = getMatchSetCombos(players);

  function updateSetScore(
    setIndex: number,
    pair: "pair1" | "pair2",
    value: string,
  ) {
    if (value !== "" && !/^\d+$/.test(value)) return;

    const updatedScores = [...setScores];
    updatedScores[setIndex][pair] = value;

    setSetScores(updatedScores);
  }

  function updateParticipation(
    playerIndex: number,
    field: "attends" | "substituteId",
    value: boolean | number | null,
  ) {
    const updatedParticipation = [...playerParticipation];

    if (field === "attends") {
      updatedParticipation[playerIndex].attends = value as boolean;

      if (!value) {
        updatedParticipation[playerIndex].substituteId = null;
      }
    }

    if (field === "substituteId") {
      updatedParticipation[playerIndex].substituteId = value as number;
    }

    setPlayerParticipation(updatedParticipation);
  }

  async function handleSubmit() {
    if (setScores.some((set) => set.pair1 === "" || set.pair2 === "")) {
      toast.error("No se han introducido todos los resultados");
      return;
    }

    if (
      playerParticipation.some(
        (player) => !player.attends && player.substituteId === null,
      )
    ) {
      toast.error(
        "Debes seleccionar un sustituto para todos los jugadores ausentes",
      );
      return;
    }

    const matchSets = setPairings.map((pairing, setIndex) => ({
      order: setIndex + 1,
      match_id: matchId,
      pair1_player1_id: pairing[0].id,
      pair1_player2_id: pairing[1].id,
      pair2_player1_id: pairing[2].id,
      pair2_player2_id: pairing[3].id,
      pair1_score: Number(setScores[setIndex].pair1),
      pair2_score: Number(setScores[setIndex].pair2),
    }));

    const participationData = playerParticipation.map((player) => ({
      match_id: matchId,
      player_id: player.playerId,
      substitute_id: player.attends ? null : player.substituteId,
    }));

    const result = await registerMatchResults(
      matchId,
      matchSets,
      participationData,
    );

    if (!result.success) {
      return toast.error("Ha ocurrido un error al registrar los resultados");
    }

    toast.success("Resultados registrados correctamente");

    redirect("/liga/partidos");
  }

  function isPlayerAbsent(playerId: number) {
    return playerParticipation.some(
      (player) => player.playerId === playerId && !player.attends,
    );
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
              {players.map((player, playerIndex) => (
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
                        checked={playerParticipation[playerIndex].attends}
                        onCheckedChange={(checked) =>
                          updateParticipation(
                            playerIndex,
                            "attends",
                            checked === true,
                          )
                        }
                      />
                      Asiste
                    </label>

                    {!playerParticipation[playerIndex].attends && (
                      <Select
                        value={
                          playerParticipation[
                            playerIndex
                          ].substituteId?.toString() || ""
                        }
                        onValueChange={(value) =>
                          updateParticipation(
                            playerIndex,
                            "substituteId",
                            value === "" ? null : Number(value),
                          )
                        }
                      >
                        <SelectTrigger size="sm" className="w-56">
                          <SelectValue placeholder="Selecciona un sustituto">
                            {(() => {
                              const sustitutoId =
                                playerParticipation[playerIndex].substituteId;
                              if (!sustitutoId) return undefined;

                              const socioSustituto = members.find(
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
                            {members
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
        {setPairings.map((pairing, index) => (
          <SetCard
            key={index}
            title={`Set ${index + 1}`}
            team1={{
              players: [
                {
                  id: pairing[0].id,
                  full_name: pairing[0].full_name,
                  nickname: pairing[0].nickname,
                  isAbsent: isPlayerAbsent(pairing[0].id),
                },
                {
                  id: pairing[1].id,
                  full_name: pairing[1].full_name,
                  nickname: pairing[1].nickname,
                  isAbsent: isPlayerAbsent(pairing[1].id),
                },
              ],
              score: (
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  className="w-16 text-center"
                  value={setScores[index].pair1}
                  onChange={(e) =>
                    updateSetScore(index, "pair1", e.target.value)
                  }
                />
              ),
            }}
            team2={{
              players: [
                {
                  id: pairing[2].id,
                  full_name: pairing[2].full_name,
                  nickname: pairing[2].nickname,
                  isAbsent: isPlayerAbsent(pairing[2].id),
                },
                {
                  id: pairing[3].id,
                  full_name: pairing[3].full_name,
                  nickname: pairing[3].nickname,
                  isAbsent: isPlayerAbsent(pairing[3].id),
                },
              ],
              score: (
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  className="w-16 text-center"
                  value={setScores[index].pair2}
                  onChange={(e) =>
                    updateSetScore(index, "pair2", e.target.value)
                  }
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
