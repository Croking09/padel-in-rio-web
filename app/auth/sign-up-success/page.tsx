"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Button } from "@/components/ui/button";

export default function Page() {
  const supabase = createClient();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!cooldown) return;

    const timer = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const email =
    typeof window !== "undefined"
      ? sessionStorage.getItem("pendingEmail")
      : null;

  const verify = async () => {
    if (!email) return;

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    setLoading(false);

    if (error) {
      setError("Código inválido o expirado");
      return;
    }

    window.location.href = "/";
  };

  const resend = async () => {
    if (!email || cooldown > 0) return;

    await supabase.auth.signInWithOtp({ email });

    setCooldown(30);
  };

  return (
    <div className="flex w-full min-h-[80dvh] items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                ¡Gracias por registrarte!
              </CardTitle>
              <CardDescription>¡Casi has terminado!</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <p className="text-sm">
                Introduce el código que hemos enviado a tu correo:
              </p>

              <InputOTP
                value={code}
                onChange={(value) => {
                  setCode(value);
                }}
                maxLength={6}
              >
                <InputOTPGroup className="mx-auto">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              {error && <p className="text-sm text-error">{error}</p>}

              <Button
                onClick={verify}
                disabled={loading || code.length < 6}
                className="w-fit mx-auto"
              >
                Verificar
              </Button>

              <Button
                variant="link"
                onClick={resend}
                className="text-sm underline text-foreground"
              >
                {cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar código"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
