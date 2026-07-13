import { createClient } from "@/lib/supabase/server";

export const authRepository = {
  async getCurrentUserServer() {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;
    return user;
  },
};
