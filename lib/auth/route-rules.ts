// Rutas que se sirven directamente, sin comprobar auth (pero sí refrescan sesión)
const BYPASS_PREFIXES = [
  "/manifest",
  "/_next",
  "/icons",
  "/tutorial-instalacion",
  "/screenshots",
];

export function isBypassPath(pathname: string): boolean {
  if (BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }
  // PDFs públicos de la asociación
  return pathname.startsWith("/asociacion/") && pathname.endsWith(".pdf");
}

export function isAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

const PUBLIC_PATHS = [
  "/",
  "/politica-de-cookies",
  "/auth/login",
  "/auth/sign-up",
  "/auth/sign-up-success",
  "/auth/forgot-password",
  "/auth/update-password",
  "/auth/error",
  "/torneos",
  "/liga/reglamento",
  "/liga/partidos",
  "/liga/ascensor",
  "/liga/clasificacion",
  "/asociacion",
  "/asociacion/historico",
  "/equipo",
];

const PUBLIC_PATH_REGEXES = [/^\/liga\/partidos\/[^/]+\/resultados$/];

export function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return PUBLIC_PATH_REGEXES.some((re) => re.test(pathname));
}
