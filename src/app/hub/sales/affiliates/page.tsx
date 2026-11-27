import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { canSales } from "@/lib/rbac";
import { Field, PageTitle } from "@/components/ui";
import { createClient, postAnnouncement, updateClient } from "../../actions";

export default async function Affiliates() {
  await requireUser(canSales);
  const affiliates = await db.client.findMany({
    where: { status: { in: ["AFFILIATE", "CLIENT"] } },
    orderBy: { name: "asc" },
  });
  return (
    <>
      <PageTitle title="Affiliate Management" sub="Create affiliate profiles and post announcements to their public pages." />

      <h2 className="mb-3 text-lg font-bold text-white">New affiliate profile</h2>
      <form action={createClient} className="card grid max-w-3xl gap-3 sm:grid-cols-2">
        <input type="hidden" name="status" value="AFFILIATE" />
        <Field label="Name"><input name="name" required className="input" /></Field>
        <Field label="Logo URL"><input name="logoUrl" className="input" /></Field>
        <Field label="Roblox group URL"><input name="robloxUrl" className="input" /></Field>
        <Field label="Discord invite"><input name="discordInvite" className="input" /></Field>
        <div className="sm:col-span-2"><Field label="Description"><textarea name="description" rows={2} className="input" /></Field></div>
        <div className="sm:col-span-2"><Field label="Advertisement"><textarea name="adText" rows={3} className="input" /></Field></div>
        <div><button className="btn-primary">Create affiliate</button></div>
      </form>

      <h2 className="mb-3 mt-10 text-lg font-bold text-white">Manage pages</h2>
      <div className="space-y-4">
        {affiliates.map((a) => (
          <details key={a.id} className="card">
            <summary className="cursor-pointer font-semibold text-white">{a.name} <span className="text-xs text-slate-500">/{a.slug}</span></summary>
            <form action={updateClient} className="mt-4 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={a.id} />
              <Field label="Logo URL"><input name="logoUrl" defaultValue={a.logoUrl ?? ""} className="input" /></Field>
              <Field label="Roblox group URL"><input name="robloxUrl" defaultValue={a.robloxUrl ?? ""} className="input" /></Field>
              <Field label="Discord invite"><input name="discordInvite" defaultValue={a.discordInvite ?? ""} className="input" /></Field>
              <div className="sm:col-span-2"><Field label="Description"><textarea name="description" defaultValue={a.description ?? ""} rows={2} className="input" /></Field></div>
              <div className="sm:col-span-2"><Field label="Advertisement"><textarea name="adText" defaultValue={a.adText ?? ""} rows={3} className="input" /></Field></div>
              <div><button className="btn-ghost">Save page</button></div>
            </form>
            <form action={postAnnouncement} className="mt-4 grid gap-3 border-t border-line pt-4">
              <input type="hidden" name="clientId" value={a.id} />
              <Field label="Announcement title"><input name="title" required className="input" /></Field>
              <Field label="Body"><textarea name="body" required rows={3} className="input" /></Field>
              <div><button className="btn-primary">Post announcement</button></div>
            </form>
          </details>
        ))}
        {!affiliates.length && <p className="text-slate-500">No affiliates yet.</p>}
      </div>
    </>
  );
}
