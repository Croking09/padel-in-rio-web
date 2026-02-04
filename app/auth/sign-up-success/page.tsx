"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  const supabase = createClient();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!email) return;

    await supabase.auth.signInWithOtp({ email });
  };

  return (
    <div className="flex w-full items-center justify-center p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                ¡Gracias por registrarte!
              </CardTitle>
              <CardDescription>¡Casi has terminado!</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <p className="text-sm">
                Introduce el código que hemos enviado a tu correo:
              </p>

              <Input
                placeholder="Código de 6 dígitos"
                value={code}
                maxLength={6}
                onChange={(e) => setCode(e.target.value)}
              />

              {error && <p className="text-sm text-error">{error}</p>}

              <Button
                onClick={verify}
                disabled={loading || code.length < 6}
                variant="secondary"
              >
                Verificar
              </Button>

              <button
                onClick={resend}
                className="text-sm underline text-muted-foreground hover:cursor-pointer"
              >
                Reenviar código
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
