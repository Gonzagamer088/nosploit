import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { isCEO } from "@/lib/rbac";
import { PageTitle } from "@/components/ui";
import { resolveRequest } from "../../actions";

export default async function Approvals() {
  await requireUser(isCEO);
  const pending = await db.licenseRequest.findMany({
    where: { status: "PENDING" },
    include: { client: true, requester: { select: { displayName: true } } },
    orderBy: { createdAt: "asc" },
  });
  const done = await db.licenseRequest.findMany({
    where: { status: { not: "PENDING" } },
    include: { client: { select: { name: true } } },
    orderBy: { resolvedAt: "desc" },
    take: 20,
  });
  return (
    <>
      <PageTitle title="License Approval Queue" />
      <div className="space-y-3">
        {pending.map((r) => (
          <div key={r.id} className="card">
            <div className="flex justify-between">
              <span className="font-semibold text-white">{r.client.name}</span>
              <span className="badge">{r.kind === "CREATE" ? "License creation" : "License suspension"}</span>
            </div>
            <div className="text-xs text-slate-500">Requested by {r.requester.displayName} · {r.createdAt.toLocaleString("en-US")}</div>
            {r.notes && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{r.notes}</p>}
            <form action={resolveRequest} className="mt-3 flex flex-wrap gap-2">
              <input type="hidden" name="id" value={r.id} />
              {r.kind === "CREATE" && (
                <div className="grid w-full gap-2 sm:grid-cols-2">
                  <div className="text-sm text-slate-400 sm:col-span-2">Product: <b className="text-white">{r.product}</b></div>
                  <select name="subjectType" defaultValue="GROUP" className="input">
                    <option value="GROUP">Group</option><option value="USER">User</option><option value="GAME">Game</option>
                  </select>
                  <input name="subjectId" defaultValue={r.client.robloxGroupId ?? ""} placeholder="Roblox group/user/game ID" className="input" />
                  <input name="licenseKey" placeholder="License key (blank = auto-generate)" className="input" />
                  <input name="expiresAt" type="date" title="Expiry (optional)" className="input" />
                </div>
              )}
              <button name="action" value="complete" className="btn-primary">{r.kind === "CREATE" ? "Send key" : "Confirm suspension"}</button>
              <button name="action" value="reject" className="btn-danger">Reject</button>
            </form>
          </div>
        ))}
        {!pending.length && <p className="text-slate-500">No pending requests.</p>}
      </div>
      <h2 className="mb-3 mt-10 text-lg font-bold text-white">Recently resolved</h2>
      <div className="space-y-2">
        {done.map((r) => (
          <div key={r.id} className="card flex justify-between text-sm">
            <span>{r.client.name} · {r.kind}</span><span className="badge">{r.status}</span>
          </div>
        ))}
      </div>
    </>
  );
}
