"use client";
import { hapticResponseSettings } from "@/lib/haptic";
import { Temporada } from "@/lib/types/temporada";
import { Check, ChevronDown } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useWebHaptics } from "web-haptics/react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function TemporadaSelector({
  temporadas,
}: {
  temporadas: Temporada[];
}) {
  const { trigger } = useWebHaptics();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  if (!temporadas || temporadas.length === 0) return null;

  const currentTemporadaId =
    searchParams.get("temporadaId") || String(temporadas[0]?.id || "");

  const currentTemporada = temporadas.find(
    (t) => String(t.id) === currentTemporadaId,
  );

  const handleSelect = (value: string) => {
    trigger(hapticResponseSettings);
    const params = new URLSearchParams(searchParams);
    params.set("temporadaId", value);
    params.delete("monthId");
    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-fit">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-8 items-center justify-between gap-2 rounded-md px-4 py-2 cursor-pointer",
          "text-sm transition-colors",
          "focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="truncate">
          {currentTemporada
            ? `Temporada ${currentTemporada.name}`
            : "Seleccionar"}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            "absolute left-0 top-full z-50 mt-1 w-full",
            "overflow-hidden rounded-md border border-border bg-background",
            "animate-in fade-in-0 duration-100",
          )}
          style={{ minWidth: containerRef.current?.offsetWidth }}
        >
          <div>
            {temporadas.map((t) => {
              const isSelected = String(t.id) === currentTemporadaId;
              return (
                <button
                  key={t.id}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => handleSelect(String(t.id))}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2",
                    "text-sm outline-none transition-colors",
                    "hover:bg-primary",
                  )}
                >
                  {isSelected && (
                    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                  Temporada {t.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
