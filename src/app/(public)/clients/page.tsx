import Link from "next/link";
import { db } from "@/lib/db";
import { Avatar, StatusBadge, delay } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Clients & Affiliates" };

export default async function Clients() {
  // Visibility toggle: suspended clients (and non client/affiliate states) never appear publicly
  const clients = await db.client.findMany({
    where: { status: { in: ["CLIENT", "AFFILIATE"] } },
    orderBy: [{ status: "asc" }, { name: "asc" }],
    select: { slug: true, name: true, logoUrl: true, status: true, adText: true, description: true },
  });
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="reveal text-4xl font-extrabold text-white">Clients &amp; Affiliates</h1>
      <p className="mt-3 text-slate-400">Groups protected by or partnered with Nosploit.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((c, i) => (
          <Link key={c.slug} href={`/clients/${c.slug}`} className="card card-hover reveal group" style={delay(i)}>
            <div className="flex items-center gap-3">
              <Avatar src={c.logoUrl} name={c.name} size={48} />
              <div>
                <div className="font-semibold text-white">{c.name}</div>
                <StatusBadge status={c.status} />
              </div>
            </div>
            <p className="mt-3 line-clamp-3 text-sm text-slate-400">{c.adText || c.description}</p>
          </Link>
        ))}
      </div>
      {!clients.length && <p className="mt-10 text-slate-400">No partners to show yet.</p>}
    </div>
  );
}
