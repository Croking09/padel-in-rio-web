"use client";

import Image from "next/image";
import { useState } from "react";

export default function TournamentImage({
  imageUrl,
  name,
}: {
  imageUrl?: string | null;
  name: string;
}) {
  const fallback = "/torneos/fallback.png";

  const [src, setSrc] = useState(imageUrl ?? fallback);

  return (
    <Image
      src={src}
      alt={name}
      fill
      className="object-cover"
      unoptimized
      loading="eager"
      onError={() => {
        if (src !== fallback) {
          setSrc(fallback);
        }
      }}
    />
  );
}
