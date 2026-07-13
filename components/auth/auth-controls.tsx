import { AvatarMenu } from "./avatar-menu";
import AuthLinks from "./auth-links";
import { authServerService } from "@/lib/auth/services/server-service";

export async function AuthControls({ compact = false }: { compact?: boolean }) {
  const user = await authServerService.getCurrentUser();

  return user ? <AvatarMenu user={user} /> : <AuthLinks compact={compact} />;
}
