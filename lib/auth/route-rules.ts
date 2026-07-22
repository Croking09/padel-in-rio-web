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

// Solo las rutas que EXIGEN sesión (aparte de /admin, gestionado aparte)
const PROTECTED_PATH_REGEXES: RegExp[] = [/^\/torneos\/[^/]+\/inscripcion$/];

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATH_REGEXES.some((re) => re.test(pathname));
}
