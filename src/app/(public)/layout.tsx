import Link from "next/link";
import { Logo, NavLink } from "@/components/ui";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-white">
            <Logo size={34} />
            <span>NO<span className="text-brand-soft">SPLOIT</span></span>
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
      <footer className="border-t border-line py-6 text-center text-xs text-slate-500">
        <div className="mb-2 flex justify-center gap-4">
          <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
        </div>
        © {new Date().getFullYear()} Nosploit. All rights reserved.
      </footer>
    </div>
  );
}
