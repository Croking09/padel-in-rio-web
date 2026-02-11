"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-2xl">
        ☰
      </button>

      <nav
        className={`
          fixed left-0 top-0 w-full z-40
          bg-primary
          md:static md:w-auto md:h-auto md:bg-transparent

          transition-all duration-300 ease-out
          transform

          ${
            isOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }

          md:opacity-100 md:translate-y-0 md:pointer-events-auto
        `}
      >
        <ul
          className="flex flex-col gap-0 pt-8 font-bold text-2xl w-full justify-center items-center
               md:flex-row md:gap-8 md:p-0 md:justify-start
               divide-y-2 divide-border md:divide-y-0"
        >
          <li className="w-full text-center py-4 md:w-auto md:py-0">
            <Link
              href="/torneos"
              className="hover:text-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              TORNEOS
            </Link>
          </li>
          <li className="w-full text-center py-4 md:w-auto md:py-0">
            <Link
              href="#"
              className="hover:text-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              LIGA
            </Link>
          </li>
          <li className="w-full text-center py-4 md:w-auto md:py-0">
            <Link
              href="/asociacion"
              className="hover:text-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              ASOCIACION
            </Link>
          </li>
          <li className="w-full text-center py-4 md:w-auto md:py-0">
            <Link
              href="#"
              className="hover:text-secondary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              EQUIPO
            </Link>
          </li>
        </ul>
      </nav>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
