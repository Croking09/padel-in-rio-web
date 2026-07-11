"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Award, Users, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    href: "/torneos",
    label: "Torneos",
    icon: Trophy,
    match: ["/torneos", "/admin/torneos"],
  },
  {
    href: "/liga/ascensor",
    label: "Liga",
    icon: Award,
    match: ["/liga", "/admin/liga"],
  },
  {
    href: "/asociacion",
    label: "Asociación",
    icon: Users,
    match: ["/asociacion", "/admin/asociacion"],
  },
  {
    href: "/equipo",
    label: "Equipo",
    icon: Shield,
    match: ["/equipo", "/admin/equipo"],
  },
];

function getScrollY() {
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

function BottomTabBarContent() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = getScrollY();

    const update = () => {
      const y = getScrollY();
      const delta = y - lastY.current;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (y < 0 || y > maxScroll) {
        ticking.current = false;
        return;
      }

      if (Math.abs(delta) > 12) {
        if (y < 60) {
          setVisible(true);
        } else {
          setVisible(delta < 0);
        }

        lastY.current = y;
      }

      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 z-50 w-full px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] transition-transform duration-300 will-change-transform lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <ul
        className={cn(
          "mx-auto flex max-w-sm items-center justify-around rounded-full",
          "border bg-secondary/75 backdrop-blur-md px-2 py-2",
        )}
      >
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const isActive = match.some(
            (route) => pathname === route || pathname.startsWith(`${route}/`),
          );

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-full py-2 text-xs font-medium transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-5" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function BottomTabBar() {
  return (
    <Suspense
      fallback={
        <div className="fixed bottom-0 left-0 z-50 h-16 w-full animate-pulse border-t bg-card/70 backdrop-blur-sm md:hidden" />
      }
    >
      <BottomTabBarContent />
    </Suspense>
  );
}
