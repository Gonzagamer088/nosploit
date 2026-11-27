import Link from "next/link";
import { STATUS_LABEL } from "@/lib/rbac";

export const ROBLOX_URL = process.env.NEXT_PUBLIC_ROBLOX_GROUP_URL || "https://www.roblox.com/communities/988993149/Nosploit#!/about";
export const DISCORD_URL = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "https://discord.gg/zjxvdWdwgS";
export const PORTFOLIO_URL = "https://nosploit.carrd.co/";

export function Logo({ size = 32 }: { size?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.png" alt="Nosploit logo" width={size} height={size} style={{ width: size, height: size }} />;
}

export function Avatar({ src, name, size = 64 }: { src?: string | null; name: string; size?: number }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={name} width={size} height={size} className="rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <div className="flex items-center justify-center rounded-full bg-brand/30 font-bold text-brand-soft" style={{ width: size, height: size }}>
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

const STATUS_COLOR: Record<string, string> = {
  CLIENT: "text-emerald-300 border-emerald-500/40",
  AFFILIATE: "text-sky-300 border-sky-500/40",
  IN_TALKS: "text-amber-300 border-amber-500/40",
  DECLINED: "text-slate-400",
  UNABLE_TO_SERVE: "text-slate-400",
  ENDED: "text-slate-400",
  SUSPENDED: "text-red-300 border-red-500/40",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge ${STATUS_COLOR[status] ?? ""}`}>{STATUS_LABEL[status] ?? status}</span>;
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {sub && <p className="mt-1 text-sm text-slate-400">{sub}</p>}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

export function CTAButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <a href={ROBLOX_URL} target="_blank" rel="noopener noreferrer" className="btn-primary px-6 py-3 text-base">
        Join our Roblox Group
      </a>
      <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost px-6 py-3 text-base">
        Join our Discord
      </a>
    </div>
  );
}

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm text-slate-300 hover:text-white">
      {children}
    </Link>
  );
}
