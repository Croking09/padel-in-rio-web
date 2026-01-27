import { cloneElement } from "react";
import type { IconCardProps } from "./types";

export default function IconCard({ title, subtitle, icon }: IconCardProps) {
  return (
    <div className="aspect-square md:h-36 pt-2 pb-4 gap-2 rounded-2xl inline-flex flex-col items-center justify-center bg-primary shadow-[10px_10px_10px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col items-center justify-center font-bold text-lg">
        <span>{title}</span>
        <span>{subtitle}</span>
      </div>

      {cloneElement(icon, { className: "w-20 h-20 text-secondary" })}
    </div>
  );
}
