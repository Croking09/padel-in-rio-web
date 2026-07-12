"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

function getInitials(user: {
  email?: string;
  user_metadata?: { full_name?: string };
}) {
  const fullName = user.user_metadata?.full_name;

  if (fullName) {
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[1][0] : "";
    return (first + last).toUpperCase();
  }

  return user.email?.slice(0, 2).toUpperCase() ?? "?";
}

export function AvatarMenu({ user }: { user: User }) {
  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src={user.user_metadata.avatar_url} />
              <AvatarFallback>{getInitials(user)}</AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent className="w-fit">
        <DropdownMenuGroup>
          <DropdownMenuItem>{user.email}</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={logout}>
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
