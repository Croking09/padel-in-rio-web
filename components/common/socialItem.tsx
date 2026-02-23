import { Button } from "../ui/button";

export default function SocialItem({
  className,
  icon,
  href,
  text,
}: {
  className?: string;
  icon: React.ReactNode;
  href: string;
  text: string;
}) {
  return (
    <div className={`flex flex-row items-center gap-6 ${className}`}>
      {icon}
      <Button asChild className="font-bold text-sm p-0" variant="link">
        <a href={href}>{text}</a>
      </Button>
    </div>
  );
}
