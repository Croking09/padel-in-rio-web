"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Award, Users, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/torneos", label: "Torneos", icon: Trophy },
  { href: "/liga/ascensor", label: "Liga", icon: Award },
  { href: "/asociacion", label: "Asociación", icon: Users },
  { href: "/equipo", label: "Equipo", icon: Shield },
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
        const goingDown = delta > 0;

        if (y < 60) {
          setVisible(true);
        } else {
          setVisible(!goingDown);
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

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav
      className={cn(
        "lg:hidden fixed bottom-0 left-0 w-full z-50 px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] transition-transform duration-300 will-change-transform",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <ul
        className="flex items-center justify-around mx-auto max-w-sm
                   rounded-full border bg-card/70
                   backdrop-blur-sm px-2 py-2"
      >
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-full py-2 text-xs font-medium transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
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
        <div className="lg:hidden fixed bottom-0 left-0 w-full h-16 bg-card/70 backdrop-blur-sm z-50 border-t animate-pulse" />
      }
    >
      <BottomTabBarContent />
    </Suspense>
  );
}
