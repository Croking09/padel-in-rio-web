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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AuthError,
  AuthWeakPasswordError,
  isAuthApiError,
} from "@supabase/supabase-js";
import { formatWeakPasswordReasons } from "@/lib/auth/auth-flows-error";
import { authClientService } from "@/lib/auth/services/client-service";
import { Eye, EyeOff } from "lucide-react";

type FieldErrors = {
  root?: string;
  password?: string;
};

function getUpdatePasswordFieldErrors(error: unknown): FieldErrors {
  if (isAuthApiError(error)) {
    return {
      root: "No se pudo conectar. Revisa tu conexión e inténtalo de nuevo.",
    };
  }

  const authError = error as AuthError;

  switch (authError.code) {
    case "weak_password": {
      const reasons = (error as AuthWeakPasswordError).reasons;
      return {
        password: reasons?.length
          ? `La contraseña ${formatWeakPasswordReasons(reasons)}.`
          : "La contraseña no cumple los requisitos mínimos de seguridad.",
      };
    }

    case "same_password":
      return { password: "La nueva contraseña debe ser distinta a la actual." };

    case "reauthentication_needed":
      return {
        root: "Por seguridad, necesitas volver a iniciar sesión antes de cambiar la contraseña.",
      };

    case "session_not_found":
    case "session_expired":
      return {
        root: 'El enlace ha caducado o ya se usó. Solicita uno nuevo desde "¿Olvidaste tu contraseña?".',
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

export function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setErrors({});

    try {
      await authClientService.updatePassword(password);
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/");
    } catch (error) {
      setErrors(getUpdatePasswordFieldErrors(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Cambia tu contraseña
        </CardTitle>
        <CardDescription>
          Por favor, introduce tu nueva contraseña.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdatePassword}>
          <FieldGroup>
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Nueva contraseña</FieldLabel>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  aria-invalid={!!errors.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </Button>
              </div>

              {errors.password ? (
                <FieldError>{errors.password}</FieldError>
              ) : (
                <FieldDescription>Mínimo 6 caracteres.</FieldDescription>
              )}
            </Field>

            {errors.root && (
              <FieldError className="text-center">{errors.root}</FieldError>
            )}

            <Field>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Actualizar contraseña"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
