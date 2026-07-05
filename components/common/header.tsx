import NavBar from "./navBar";
import InstallTutorialCarousel from "./installTutorialCarousel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Logo } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { AuthButton } from "@/components/auth/auth-button";
import { Suspense } from "react";
import AuthButtonSkeleton from "@/components/auth/auth-button-skeleton";

export default function Header() {
  return (
    <>
      <header className="bg-card flex flex-row p-4 justify-between items-center">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/">
            <Logo className="w-15 h-15 hover:text-primary hover:scale-110 transition-all duration-300" />
          </Link>

          <Dialog>
            <DialogTrigger
              className="hide-in-standalone"
              render={<Button>Instálame</Button>}
            />
            <DialogContent className="w-[92vw] max-w-sm sm:max-w-md max-h-[90dvh] flex flex-col items-center border-border/50 p-8">
              <DialogHeader className="w-full text-center space-y-1.5 mb-2">
                <DialogTitle className="text-xl">
                  También somos una App
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed">
                  Accede más rápido a todo lo que te ofrecemos.
                  <span className="block mt-2 text-xs">
                    <span className="text-destructive font-medium">*</span> Los
                    pasos pueden variar según navegador y dispositivo.
                  </span>
                </DialogDescription>
              </DialogHeader>

              <Separator />

              <div className="w-full flex items-center justify-center overflow-hidden">
                <InstallTutorialCarousel />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <NavBar />

        <Suspense fallback={<AuthButtonSkeleton />}>
          <AuthButton compact />
        </Suspense>
      </header>
    </>
  );
}
