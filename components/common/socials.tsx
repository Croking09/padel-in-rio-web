import { Instagram, Gmail, WhatsApp, Telegram } from "@/components/icons";
import SocialItem from "./socialItem";

export default function Socials({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <SocialItem
        icon={<Gmail className="w-8 h-8" />}
        href="mailto:padelinrio@gmail.com"
        text="padelinrio@gmail.com"
      />

      <SocialItem
        icon={<Instagram className="w-8 h-8" />}
        href="https://www.instagram.com/padel.in.rio/"
        text="@padel.in.rio"
      />

      <SocialItem
        icon={<WhatsApp className="w-8 h-8" />}
        href="tel:+34696503898"
        text="696 50 38 98"
      />

      <SocialItem
        icon={<Telegram className="w-8 h-8" />}
        href="https://t.me/Padel_in_Rio_bot"
        text="t.me/Padel_in_Rio_bot"
      />
    </div>
  );
}
