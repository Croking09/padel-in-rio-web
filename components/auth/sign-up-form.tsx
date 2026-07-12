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
  FieldSeparator,
} from "@/components/ui/field";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AuthError,
  AuthWeakPasswordError,
  isAuthApiError,
} from "@supabase/supabase-js";
import { Google } from "@/components/icons";
import { formatWeakPasswordReasons } from "@/lib/auth/auth-flows-error";

type FieldErrors = {
  root?: string;
  email?: string;
  password?: string;
  repeatPassword?: string;
};

function getSignUpFieldErrors(error: unknown): FieldErrors {
  if (isAuthApiError(error)) {
    return {
      root: "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.",
    };
  }

  const authError = error as AuthError;

  switch (authError.code) {
    case "email_exists":
    case "user_already_exists":
      return {
        email: "Este correo ya está registrado. Intenta iniciar sesión.",
      };

    case "email_address_invalid":
      return { email: "Ese formato de correo no es válido." };

    case "over_email_send_rate_limit":
      return {
        email:
          "Se han enviado demasiados correos a esta dirección. Espera unos minutos.",
      };

    case "weak_password": {
      const reasons = (error as AuthWeakPasswordError).reasons;
      return {
        password: reasons?.length
          ? `La contraseña ${formatWeakPasswordReasons(reasons)}.`
          : "La contraseña no cumple los requisitos mínimos de seguridad.",
      };
    }

    case "over_request_rate_limit":
      return {
        root: "Demasiados intentos. Espera un momento antes de volver a intentarlo.",
      };

    case "signup_disabled":
    case "email_provider_disabled":
      return {
        root: "El registro con email no está disponible en este momento.",
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
  if (!isAuthApiError(error)) {
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

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setErrors({});

    if (password !== repeatPassword) {
      setErrors({ repeatPassword: "Las contraseñas no coinciden." });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;

      sessionStorage.setItem("pendingEmail", email);
      router.push("/auth/sign-up-success");
    } catch (error) {
      setErrors(getSignUpFieldErrors(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const supabase = createClient();
    setErrors({});
    setIsGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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
        <CardTitle className="text-2xl font-bold">Regístrate</CardTitle>
        <CardDescription>Crea una nueva cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading || isLoading}
            >
              <Google />
              {isGoogleLoading ? "Conectando..." : "Continuar con Google"}
            </Button>
          </Field>

          <FieldSeparator>O continúa con email</FieldSeparator>

          <form onSubmit={handleSignUp}>
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
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  required
                  aria-invalid={!!errors.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password ? (
                  <FieldError>{errors.password}</FieldError>
                ) : (
                  <FieldDescription>Mínimo 6 caracteres.</FieldDescription>
                )}
              </Field>

              <Field data-invalid={!!errors.repeatPassword}>
                <FieldLabel htmlFor="repeat-password">
                  Repite la contraseña
                </FieldLabel>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  aria-invalid={!!errors.repeatPassword}
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
                {errors.repeatPassword && (
                  <FieldError>{errors.repeatPassword}</FieldError>
                )}
              </Field>

              {errors.root && (
                <FieldError className="text-center">{errors.root}</FieldError>
              )}

              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creando una cuenta..." : "Regístrarse"}
                </Button>
                <FieldDescription className="text-center">
                  ¿Ya tienes cuenta?{" "}
                  <Link
                    href="/auth/login"
                    className="underline underline-offset-4"
                  >
                    Inicia Sesión
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
