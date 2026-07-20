"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { AuthError, isAuthApiError } from "@supabase/supabase-js";
import { authClientService } from "@/lib/auth/services/client-service";

type FieldErrors = {
  root?: string;
  email?: string;
};

function getForgotPasswordFieldErrors(error: unknown): FieldErrors {
  if (isAuthApiError(error)) {
    return {
      root: "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.",
    };
  }

  const authError = error as AuthError;

  switch (authError.code) {
    case "email_address_invalid":
      return { email: "Ese formato de correo no es válido." };

    case "over_email_send_rate_limit":
      return {
        email:
          "Se han enviado demasiados correos a esta dirección. Espera unos minutos.",
      };

    case "over_request_rate_limit":
      return {
        root: "Demasiados intentos. Espera un momento antes de volver a intentarlo.",
      };

    case "validation_failed":
      return { root: "Revisa los datos introducidos e inténtalo de nuevo." };

    default:
      return { root: "Ha ocurrido un error. Inténtalo de nuevo." };
  }
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await authClientService.resetPassword(email);
      setSuccess(true);
    } catch (error) {
      setErrors(getForgotPasswordFieldErrors(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Comprueba tu correo
            </CardTitle>
            <CardDescription>Se han enviado las instrucciones.</CardDescription>
          </CardHeader>
          <CardContent>
            Se te ha enviado un correo con las instrucciones para cambiar tu
            contraseña.
          </CardContent>
          <CardContent className="text-muted-foreground">
            Puedes cerrar esta ventana.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Cambia tu contraseña
            </CardTitle>
            <CardDescription>
              Escribe tu email y te enviaremos un enlace para cambiar tu
              contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <FieldGroup>
                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@ejemplo.com"
                    required
                    aria-invalid={!!errors.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <FieldError>{errors.email}</FieldError>}
                </Field>

                {errors.root && (
                  <FieldError className="text-center">{errors.root}</FieldError>
                )}

                <Field>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Enviando..." : "Enviar enlace"}
                  </Button>
                </Field>
              </FieldGroup>

              <div className="mt-4 text-center text-sm">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Inicia Sesión
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
