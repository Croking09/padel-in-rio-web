import { JSX } from "react";
import IconCard from "./iconCard";
import type { IconCardProps, IconCardType } from "./types";
import { getTournamentsCount } from "@/app/actions/tournament-actions";
import { getMembersCount } from "@/app/actions/member-actions";
import { getSeasonsCount } from "@/app/actions/season-actions";

type IconCardFromBDProps = Omit<IconCardProps, "title" | "subtitle"> & {
  type: IconCardType;
};

const actionsByType: Record<IconCardType, () => Promise<number | null>> = {
  socios: () => getMembersCount(true),
  torneos: getTournamentsCount,
  ligas: getSeasonsCount,
};

const subtitlesByType: Record<IconCardType, string> = {
  socios: "SOCIOS",
  torneos: "TORNEOS",
  ligas: "LIGAS",
};

export default async function IconCardFromBD({
  type,
  icon,
}: IconCardFromBDProps): Promise<JSX.Element> {
  const action = actionsByType[type];
  const title = await action();
  const titleString = title ?? "0";

  return (
    <IconCard
      title={String(titleString)}
      subtitle={subtitlesByType[type]}
      icon={icon}
    />
  );
}
