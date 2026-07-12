"use client";

import { createClient } from "@/lib/supabase/client";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AuthError, isAuthApiError } from "@supabase/supabase-js";
import { Google } from "@/components/icons";

type FieldErrors = {
  root?: string;
  email?: string;
  password?: string;
};

function getLoginFieldErrors(error: unknown): FieldErrors {
  if (!isAuthApiError(error)) {
    return {
      root: "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.",
    };
  }

  const authError = error as AuthError;

  switch (authError.code) {
    case "invalid_credentials":
      return { root: "Correo o contraseña incorrectos." };

    case "email_not_confirmed":
      return {
        email:
          "Debes confirmar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.",
      };

    case "user_banned":
      return { root: "Esta cuenta está suspendida. Contacta con soporte." };

    case "over_request_rate_limit":
      return {
        root: "Demasiados intentos. Espera un momento antes de volver a intentarlo.",
      };

    case "email_provider_disabled":
    case "signup_disabled":
      return {
        root: "El inicio de sesión con email no está disponible en este momento.",
      };

    case "captcha_failed":
      return {
        root: "No se pudo verificar el captcha. Recarga la página e inténtalo de nuevo.",
      };

    case "validation_failed":
      return { root: "Revisa los datos introducidos e inténtalo de nuevo." };

    default:
      return { root: "Ha ocurrido un error. Inténtalo de nuevo." };
  }
}

function getGoogleSignInErrorMessage(error: unknown): string {
  if (isAuthApiError(error)) {
    return "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.";
  }

  const authError = error as AuthError;

  switch (authError.code) {
    case "provider_disabled":
    case "oauth_provider_not_supported":
      return "El inicio de sesión con Google no está disponible en este momento.";
    case "over_request_rate_limit":
      return "Demasiados intentos. Espera un momento antes de volver a intentarlo.";
    default:
      return "No se pudo iniciar sesión con Google. Inténtalo de nuevo.";
  }
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectParam = searchParams.get("redirectTo");
  const redirectTo =
    redirectParam && redirectParam.startsWith("/") ? redirectParam : "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setErrors({});

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      router.push(redirectTo);
    } catch (error) {
      setErrors(getLoginFieldErrors(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    setErrors({});
    setIsGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(
            redirectTo,
          )}`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setErrors({ root: getGoogleSignInErrorMessage(error) });
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
        <CardDescription>
          Introduce tus datos para iniciar sesión
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isGoogleLoading || isLoading}
              onClick={handleGoogleLogin}
            >
              {isGoogleLoading ? (
                "Redirigiendo..."
              ) : (
                <>
                  <Google />
                  Continuar con Google
                </>
              )}
            </Button>
          </Field>

          <FieldSeparator>O continúa con</FieldSeparator>

          <form onSubmit={handleLogin}>
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

              <Field data-invalid={!!errors.password}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-muted-foreground"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  aria-invalid={!!errors.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <FieldError>{errors.password}</FieldError>}
              </Field>

              {errors.root && (
                <FieldError className="text-center">{errors.root}</FieldError>
              )}

              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
                <FieldDescription className="text-center">
                  ¿No tienes cuenta?{" "}
                  <Link
                    href="/auth/sign-up"
                    className="underline underline-offset-4"
                  >
                    Regístrate
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
