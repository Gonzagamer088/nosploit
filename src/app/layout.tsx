import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Nosploit", template: "%s · Nosploit" },
  description: "Roblox's #1 tech group specialising in smart moderation systems.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: { title: "Nosploit", description: "Smart moderation systems for Roblox games.", images: ["/logo-large.webp"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
