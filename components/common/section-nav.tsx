import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

  const isAdmin = user?.app_metadata?.admin === true;

  if (!isAdmin && publicLinks.length === 0) {
    return null;
  }

  if (adminLinks.length === 0 && publicLinks.length === 0) {
    return null;
  }

  return (
    <nav className="p-2 bg-primary/80 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
      <ul className="flex gap-2 overflow-x-scroll md:overflow-x-auto [&>li]:hover:bg-background/40 [&>li]:rounded-md [&>li]:px-2 [&>li]:py-1">
        {isAdmin &&
          adminLinks.map((link) => (
            <li key={link.href}>
              <Button asChild variant="ghost" className="p-0" size="xs">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            </li>
          ))}
        {publicLinks.map((link) => (
          <li key={link.href}>
            <Button asChild variant="ghost" className="p-0" size="xs">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          </li>
        ))}
      </ul>
      {children && (
        <div className="pt-2 border-t md:border-t-0 md:pt-0 border-border md:pl-4 flex justify-end">
          {children}
        </div>
      )}
    </nav>
  );
}
