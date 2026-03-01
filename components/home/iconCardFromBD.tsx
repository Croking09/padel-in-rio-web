import { getLigasCount } from "@/app/actions/ligas";
import { getActiveSociosCount } from "@/app/actions/socios";
import { getTorneosCount } from "@/app/actions/torneos";
import { JSX } from "react";
import IconCard from "./iconCard";
import type { IconCardProps, IconCardType } from "./types";

type IconCardFromBDProps = Omit<IconCardProps, "title" | "subtitle"> & {
  type: IconCardType;
};

const actionsByType: Record<IconCardType, () => Promise<number | null>> = {
  socios: getActiveSociosCount,
  torneos: getTorneosCount,
  ligas: getLigasCount,
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
