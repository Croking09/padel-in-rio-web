import Link from "next/link";

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
      <Link
        href={href}
        target="_blank"
        rel="noopener norrefer"
        className="hover:underline text-sm font-medium"
      >
        {text}
      </Link>
    </div>
  );
}
