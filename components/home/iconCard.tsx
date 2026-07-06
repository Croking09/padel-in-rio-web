import { cloneElement } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { IconCardProps } from "./types";

export default function IconCard({ title, subtitle, icon }: IconCardProps) {
  return (
    <Card className="bg-secondary aspect-square md:h-36 overflow-hidden transition-transform duration-300 hover:scale-105">
      <CardContent className="flex h-full flex-col items-center justify-center gap-4 p-0">
        <div className="flex items-center justify-center rounded-full p-2 transition-colors duration-300">
          {cloneElement(icon, {
            className: "w-10 h-10 text-primary",
            strokeWidth: 2,
          })}
        </div>

        <div className="flex flex-col items-center text-center leading-tight">
          <span className="text-2xl font-bold">{title}</span>
          <span className="text-xs font-medium uppercase tracking-wide">
            {subtitle}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
