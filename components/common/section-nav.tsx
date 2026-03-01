import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function SectionNav({
  adminLinks,
  publicLinks,
}: {
  adminLinks: { href: string; label: string }[];
  publicLinks: { href: string; label: string }[];
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin = user?.app_metadata?.admin === true;

  if (!isAdmin && publicLinks.length === 0) {
    return null;
  }

  if (adminLinks.length === 0 && publicLinks.length === 0) {
    return null;
  }

  return (
    <nav className="p-2 bg-primary/80">
      <ul className="flex gap-2 overflow-x-scroll md:overflow-x-auto [&>li]:hover:bg-background/40 [&>li]:rounded-md [&>li]:px-2 [&>li]:py-1">
        {isAdmin &&
          adminLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        {publicLinks.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
