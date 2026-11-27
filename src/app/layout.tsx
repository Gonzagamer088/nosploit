import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Nosploit", template: "%s · Nosploit" },
  description: "Nosploit — protection and licensing for Roblox groups.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
  openGraph: { title: "Nosploit", description: "Protection and licensing for Roblox groups.", images: ["/logo-large.webp"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
