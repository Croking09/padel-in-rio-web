"use client";

import { Button } from "@/components/ui/button";
import { useWebHaptics } from "web-haptics/react";

type Props = React.ComponentProps<typeof Button>;

export function HapticButton({ onClick, ...props }: Props) {
  const { trigger } = useWebHaptics();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    trigger([{ duration: 30 }, { delay: 60, duration: 40, intensity: 1 }]);
    onClick?.(e);
  };

  return <Button {...props} onClick={handleClick} />;
}
