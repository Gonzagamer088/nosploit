import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { isPubliclyVisible } from "@/lib/rbac";
import { Avatar, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ClientPage({ params }: { params: { slug: string } }) {
  const c = await db.client.findUnique({
    where: { slug: params.slug },
    include: { announcements: { orderBy: { createdAt: "desc" }, take: 20 } },
  });
  // Suspended (or otherwise non-public) clients are hidden automatically
  if (!c || !isPubliclyVisible(c.status)) notFound();
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <div className="flex items-center gap-4">
        <Avatar src={c.logoUrl} name={c.name} size={80} />
        <div>
          <h1 className="text-3xl font-extrabold text-white">{c.name}</h1>
          <StatusBadge status={c.status} />
        </div>
      </div>
      {c.description && <p className="mt-6 text-slate-300">{c.description}</p>}
      {c.status === "AFFILIATE" && c.adText && (
        <div className="card mt-6 border-brand/40">
          <div className="label">Advertisement</div>
          <p className="whitespace-pre-wrap text-slate-200">{c.adText}</p>
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        {c.robloxUrl && <a className="btn-primary" href={c.robloxUrl} target="_blank" rel="noopener noreferrer">Roblox Group</a>}
        {c.discordInvite && <a className="btn-ghost" href={c.discordInvite} target="_blank" rel="noopener noreferrer">Discord Server</a>}
      </div>
      <h2 className="mt-12 text-xl font-bold text-white">Announcements</h2>
      <div className="mt-4 space-y-3">
        {c.announcements.map((a) => (
          <div key={a.id} className="card">
            <div className="flex justify-between">
              <h3 className="font-semibold text-white">{a.title}</h3>
              <span className="text-xs text-slate-500">{a.createdAt.toLocaleDateString("en-US")}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{a.body}</p>
          </div>
        ))}
        {!c.announcements.length && <p className="text-sm text-slate-500">No announcements yet.</p>}
      </div>
    </div>
  );
}
