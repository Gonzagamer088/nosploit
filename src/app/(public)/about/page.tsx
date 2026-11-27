import { CTAButtons } from "@/components/ui";

export const metadata = { title: "About" };

const items = [
  ["Licenses", "Each partner Roblox group receives a Nosploit license issued by our executive team after review."],
  ["Investigations", "Reports are reviewed by the Investigation Team, which maintains suspensions and blacklists."],
  ["Affiliates", "Affiliates are promoted on our public directory with their own page and announcement feed."],
  ["Development", "Our engineers build and maintain the tooling that powers the service."],
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="text-4xl font-extrabold text-white">About Nosploit</h1>
      <p className="mt-4 text-lg text-slate-400">
        Nosploit provides protection services and licensing to Roblox groups, backed by a team of sales, investigation and
        engineering staff.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {items.map(([t, d]) => (
          <div key={t} className="card">
            <h3 className="font-semibold text-white">{t}</h3>
            <p className="mt-2 text-sm text-slate-400">{d}</p>
          </div>
        ))}
      </div>
      <div className="mt-10"><CTAButtons /></div>
    </div>
  );
}
