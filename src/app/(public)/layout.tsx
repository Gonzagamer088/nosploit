import Link from "next/link";
import { Logo, NavLink, Wordmark } from "@/components/ui";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-line bg-bg/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/" className="group flex items-center gap-2 text-lg">
            <span className="transition duration-300 group-hover:rotate-6 group-hover:scale-110"><Logo size={34} /></span>
            <Wordmark />
          </Link>
          <nav className="flex items-center gap-6">
            <NavLink href="/about">About</NavLink>
            <NavLink href="/staff">Staff</NavLink>
            <NavLink href="/clients">Clients &amp; Affiliates</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <Link href="/hub" className="btn-ghost py-1.5">Staff Hub</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line py-8 text-center text-xs text-slate-500">
        <div className="mb-3 flex justify-center gap-5">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
        </div>
        © {new Date().getFullYear()} Nosploit. All rights reserved.
      </footer>
    </div>
  );
}
