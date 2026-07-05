import Link from "next/link";
import { MapPin, Navigation, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CLUB_ADDRESS, directionsUrl } from "@/lib/location";
import { buttonVariants } from "@/components/ui/button";

interface LocationCardProps {
  onClose?: () => void;
}

export default function LocationCard({ onClose }: LocationCardProps) {
  return (
    <Card className="relative w-80 bg-card/90 backdrop-blur-sm">
      {onClose && (
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="absolute top-2 right-2 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      )}

      <CardContent className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold">La Central</h2>
          <p className="flex items-start gap-2 mt-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{CLUB_ADDRESS}</span>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              variant: "secondary",
              size: "default",
            })}
          >
            <Navigation className="w-4 h-4" />
            Cómo llegar
          </Link>

          <Link
            href="https://riotorto.pistas-online.com/"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "default", size: "default" })}
          >
            RESERVA
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
