export function isPgError(error: unknown, code: string): boolean {
  return (
    !!error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code: unknown }).code === code
  );
}
