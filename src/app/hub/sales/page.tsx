import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { canSales } from "@/lib/rbac";
import { PageTitle, StatusBadge, Field } from "@/components/ui";
import { createClient } from "../actions";

export default async function MyGroups() {
  const user = await requireUser(canSales);
  const mine = await db.client.findMany({ where: { assignedRepId: user.id }, orderBy: { name: "asc" } });
  return (
    <>
      <PageTitle title="My Groups" sub="Groups assigned to you or that you marked as in talks." />
      <div className="grid gap-4 lg:grid-cols-3">
        {mine.map((c) => (
          <div key={c.id} className="card">
            <div className="font-semibold text-white">{c.name}</div>
            <div className="mt-1"><StatusBadge status={c.status} /></div>
            {c.robloxUrl && <a href={c.robloxUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block text-xs text-brand-soft">Roblox group</a>}
          </div>
        ))}
        {!mine.length && <p className="text-slate-500">No groups yet. Add one below.</p>}
      </div>

      <h2 className="mb-3 mt-10 text-lg font-bold text-white">Add a group I am talking to</h2>
      <form action={createClient} className="card grid max-w-2xl gap-3 sm:grid-cols-2">
        <Field label="Group name"><input name="name" required className="input" /></Field>
        <Field label="Roblox group ID"><input name="robloxGroupId" className="input" /></Field>
        <Field label="Roblox group URL"><input name="robloxUrl" className="input" /></Field>
        <Field label="Discord invite"><input name="discordInvite" className="input" /></Field>
        <Field label="Status">
          <select name="status" defaultValue="IN_TALKS" className="input">
            {["IN_TALKS", "CLIENT", "AFFILIATE", "DECLINED", "UNABLE_TO_SERVE", "ENDED"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <div className="flex items-end"><button className="btn-primary">Add group</button></div>
      </form>
    </>
  );
}
