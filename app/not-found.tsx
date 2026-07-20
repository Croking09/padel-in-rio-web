import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { House } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[75dvh] flex-col items-center justify-center overflow-hidden text-center">
      <span className="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-[64vw] font-black leading-none text-foreground/4 rotate-90 sm:rotate-0 sm:text-[24vw] tracking-wide">
        404
      </span>

      <div className="relative z-10 flex max-w-md flex-col items-center gap-4">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Error 404
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Punto perdido.</h1>
        <h2 className="text-balance text-muted-foreground">
          Parece que tu golpe se ha ido fuera. El contenido que buscas no está
          aquí.
        </h2>
        <Link
          href="/"
          className={buttonVariants({ variant: "default", size: "default" })}
        >
          <House /> Volver al inicio
        </Link>
      </div>
    </div>
  );
}
