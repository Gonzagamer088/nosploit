import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { CASE_LABEL, canInvestigation } from "@/lib/rbac";
import { Field, PageTitle } from "@/components/ui";
import { createCase, liftCase } from "../actions";

export default async function Cases({ searchParams }: { searchParams: { q?: string; type?: string } }) {
  await requireUser(canInvestigation);
  const q = searchParams.q?.trim();
  const [cases, clients] = await Promise.all([
    db.case.findMany({
      where: {
        ...(searchParams.type ? { type: searchParams.type as never } : {}),
        ...(q ? { OR: [{ targetName: { contains: q, mode: "insensitive" } }, { targetRobloxId: q }] } : {}),
      },
      include: { client: { select: { name: true } }, createdBy: { select: { displayName: true } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    db.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  return (
    <>
      <PageTitle title="Suspensions & Blacklists" sub="Linking a suspension to a client hides its public page until the suspension is lifted." />

      <form action={createCase} className="card grid max-w-3xl gap-3 sm:grid-cols-2">
        <Field label="Case type">
          <select name="type" className="input">{Object.entries(CASE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        </Field>
        <Field label="Target type">
          <select name="targetType" className="input"><option value="USER">User</option><option value="GROUP">Group</option></select>
        </Field>
        <Field label="Name"><input name="targetName" required className="input" /></Field>
        <Field label="Roblox ID"><input name="targetRobloxId" className="input" /></Field>
        <div className="sm:col-span-2">
          <Field label="Linked client (optional)">
            <select name="clientId" className="input"><option value="">None</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          </Field>
        </div>
        <div className="sm:col-span-2"><Field label="Reason"><textarea name="reason" required rows={3} className="input" /></Field></div>
        <div className="sm:col-span-2"><Field label="Evidence"><textarea name="evidence" rows={2} className="input" /></Field></div>
        <div><button className="btn-primary">Add case</button></div>
      </form>

      <form className="mb-4 mt-10 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search name or Roblox ID" className="input max-w-xs" />
        <select name="type" defaultValue={searchParams.type ?? ""} className="input max-w-[220px]">
          <option value="">All types</option>
          {Object.entries(CASE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button className="btn-ghost">Search</button>
      </form>
      <div className="space-y-3">
        {cases.map((c) => (
          <div key={c.id} className={`card ${c.active ? "" : "opacity-60"}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-white">{c.targetName}</span>{" "}
                <span className="text-xs text-slate-500">{c.targetType} {c.targetRobloxId && `· ${c.targetRobloxId}`}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge">{CASE_LABEL[c.type]}</span>
                <span className="badge">{c.active ? "Active" : "Lifted"}</span>
              </div>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{c.reason}</p>
            {c.evidence && <p className="mt-1 whitespace-pre-wrap text-xs text-slate-500">Evidence: {c.evidence}</p>}
            <div className="mt-2 text-xs text-slate-500">
              {c.client && <>Client: {c.client.name} · </>}By {c.createdBy.displayName} · {c.createdAt.toLocaleDateString("en-US")}
            </div>
            <form action={liftCase} className="mt-3 flex gap-2">
              <input type="hidden" name="id" value={c.id} />
              {c.active ? (
                <>
                  <button name="mode" value="lift" className="btn-ghost py-1">Lift</button>
                  {c.type.endsWith("SUSPENSION") && c.type !== "APPEALED_SUSPENSION" && (
                    <button name="mode" value="appeal" className="btn-ghost py-1">Mark appealed &amp; lift</button>
                  )}
                </>
              ) : (
                <button name="mode" value="reinstate" className="btn-ghost py-1">Reinstate</button>
              )}
            </form>
          </div>
        ))}
        {!cases.length && <p className="text-slate-500">No cases found.</p>}
      </div>
    </>
  );
}
