import { ReactElement, SVGProps } from "react";

export type IconCardType = "socios" | "torneos" | "ligas";

export type IconCardProps = {
  title: string;
  subtitle: string;
  icon: ReactElement<SVGProps<SVGSVGElement>>;
};