import { Instagram, Gmail, WhatsApp } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function Socials({ className }: { className: string }) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-row items-center gap-6">
        <Gmail className="w-10 h-10" />
        <Button asChild className="font-bold text-sm p-0" variant="link">
          <a href="mailto:padelinrio@gmail.com">padelinrio@gmail.com</a>
        </Button>
      </div>

      <div className="flex flex-row items-center gap-6">
        <Instagram className="w-10 h-10" />
        <Button asChild className="font-bold text-sm p-0" variant="link">
          <a
            href="https://www.instagram.com/padel.in.rio/"
            target="_blank"
            rel="noreferrer"
          >
            @padel.in.rio
          </a>
        </Button>
      </div>

      <div className="flex flex-row items-center gap-6">
        <WhatsApp className="w-10 h-10" />
        <span className="font-bold text-sm">666 66 66 66</span>
      </div>
    </div>
  );
}
