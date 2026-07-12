const WEAK_PASSWORD_REASON_LABELS: Record<string, string> = {
  length: "debe tener como mínimo 6 caracteres.",
  pwned: "ha aparecido en filtraciones de datos conocidas, elige otra.",
};

export function formatWeakPasswordReasons(reasons: string[]): string {
  const labels = reasons.map((r) => WEAK_PASSWORD_REASON_LABELS[r] ?? r);
  return labels.join("; ");
}
