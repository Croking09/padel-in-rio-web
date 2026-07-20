import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { isAdmin } from "@/lib/auth/permissions";

export default async function SectionNav({
  adminLinks,
  publicLinks,
  children,
}: {
  adminLinks: { href: string; label: string }[];
  publicLinks: { href: string; label: string }[];
  children?: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const showAdminLinks = isAdmin(user);

  if (!showAdminLinks && publicLinks.length === 0) {
    return null;
  }

  if (adminLinks.length === 0 && publicLinks.length === 0) {
    return null;
  }

  return (
    <nav className="p-2 bg-muted flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
      <ul className="flex gap-2 overflow-x-scroll md:overflow-x-auto [&>li]:py-1">
        {showAdminLinks &&
          adminLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={buttonVariants({
                  variant: "ghost",
                  size: "xs",
                })}
              >
                {link.label}
              </Link>
            </li>
          ))}
        {publicLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={buttonVariants({
                variant: "ghost",
                size: "xs",
              })}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {children}
    </nav>
  );
}
