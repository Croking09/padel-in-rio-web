import "server-only";

import { createClient } from "@/lib/supabase/server";

export const authServerService = {
  async getCurrentUser() {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;
    return user;
  },
};
