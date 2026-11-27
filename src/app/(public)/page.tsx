import Link from "next/link";
import { CTAButtons, Logo } from "@/components/ui";

const features = [
  { t: "Group licensing", d: "Licensed protection for your Roblox group, issued and managed by our team." },
  { t: "Active investigations", d: "A dedicated Investigation Team handles blacklists and suspensions." },
  { t: "Trusted partners", d: "Browse the clients and affiliates that rely on Nosploit." },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(109,94,252,0.25),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-5 py-28 text-center">
          <div className="mb-4 flex justify-center"><Logo size={112} /></div>
          <span className="badge text-brand-soft">Roblox group protection</span>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            Keep your Roblox group <span className="text-brand-soft">safe</span> with Nosploit
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
            Licenses, blacklists and a dedicated team working to protect communities across Roblox.
          </p>
          <div className="mt-8 flex justify-center">
            <CTAButtons />
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-24 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.t} className="card">
            <h3 className="font-semibold text-white">{f.t}</h3>
            <p className="mt-2 text-sm text-slate-400">{f.d}</p>
          </div>
        ))}
        <div className="sm:col-span-3 text-center">
          <Link href="/about" className="text-sm text-brand-soft hover:underline">Learn more about Nosploit →</Link>
        </div>
      </section>
    </>
  );
}
