import LigaNav from "@/components/liga/liga-nav";

export default function LigaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LigaNav>{children}</LigaNav>;
}
