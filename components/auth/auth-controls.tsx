import { createClient } from "@/lib/supabase/server";
import { AvatarMenu } from "./avatar-menu";
import AuthLinks from "./auth-links";

export async function AuthControls({ compact = false }: { compact?: boolean }) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return user ? (
    <AvatarMenu email={user.email} />
  ) : (
    <AuthLinks compact={compact} />
  );
}
