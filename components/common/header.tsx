import NavBar from "./navBar";
import LogoLink from "./logoLink";
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

export default function Header() {
  return (
    <header className="bg-primary flex flex-row p-5 shadow-bottom justify-between items-center">
      <div className="flex items-center gap-4">
        <LogoLink />

        <Dialog>
          <DialogTrigger asChild className="hide-in-standalone">
            <Button variant="secondary">Instálame</Button>
          </DialogTrigger>
          <DialogContent className="max-h-dvh flex flex-col items-center justify-center">
            <DialogHeader className="w-full text-center">
              <DialogTitle>También somos una App</DialogTitle>
              <DialogDescription className="opacity-80">
                Accede más rápido a todo lo que te ofrecemos.
                <br />
                <span className="text-red-500">*</span> Los pasos pueden variar
                según navegador y dispositivo.
              </DialogDescription>
            </DialogHeader>

            <div className="w-full flex items-center justify-center overflow-hidden">
              <InstallTutorialCarousel />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <NavBar />
    </header>
  );
}
