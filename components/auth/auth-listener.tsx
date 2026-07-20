"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthListener() {
  const router = useRouter();
  const lastUserId = useRef<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!initialized.current) {
        initialized.current = true;
        lastUserId.current = session?.user?.id ?? null;
        return;
      }

      const currentUserId = session?.user?.id ?? null;

      if (currentUserId === lastUserId.current) return;
      lastUserId.current = currentUserId;

      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "USER_UPDATED"
      ) {
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return null;
}
