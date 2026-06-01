"use client";

import { Button } from "@/components/ui/button";
import { hapticResponseSettings } from "@/lib/haptic";
import { useWebHaptics } from "web-haptics/react";

type Props = React.ComponentProps<typeof Button>;

export function HapticButton({ onClick, ...props }: Props) {
  const { trigger } = useWebHaptics();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    trigger(hapticResponseSettings);
    onClick?.(e);
  };

  return <Button {...props} onClick={handleClick} />;
}
