import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Crea un client Supabase.
 * @param useCookies Si true, se usan cookies para auth. Si false, client anónimo público.
 */
export async function createClient({ useCookies = true } = {}) {
  if (!useCookies) {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll: () => [],
          setAll: () => {},
        },
      },
    );
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have proxy refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
