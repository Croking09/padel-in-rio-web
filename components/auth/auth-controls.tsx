import { createClient } from "@/lib/supabase/server";
import { AvatarMenu } from "./avatar-menu";
import AuthLinks from "./auth-links";

export async function AuthControls({ compact = false }: { compact?: boolean }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? <AvatarMenu user={user} /> : <AuthLinks compact={compact} />;
}
