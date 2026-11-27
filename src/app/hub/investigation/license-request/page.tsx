import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { canInvestigation, isExec } from "@/lib/rbac";
import { Field, PageTitle } from "@/components/ui";
import { requestSuspension } from "../../actions";

export default async function SuspensionRequest() {
  const user = await requireUser(canInvestigation);
  const [clients, requests] = await Promise.all([
    db.client.findMany({ where: { status: { in: ["CLIENT", "AFFILIATE", "SUSPENDED"] } }, orderBy: { name: "asc" } }),
    db.licenseRequest.findMany({
      where: { kind: "SUSPEND", ...(isExec(user.role) ? {} : { requesterId: user.id }) },
      include: { client: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);
  return (
    <>
      <PageTitle title="License Suspension Request" sub="Sent to the CEO. You will be notified once it is confirmed." />
      <form action={requestSuspension} className="card grid max-w-xl gap-3">
        <Field label="Group">
          <select name="clientId" required className="input">{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        </Field>
        <Field label="Reason"><textarea name="notes" required rows={3} className="input" /></Field>
        <div><button className="btn-primary">Submit request</button></div>
      </form>
      <h2 className="mb-3 mt-10 text-lg font-bold text-white">Requests</h2>
      <div className="space-y-2">
        {requests.map((r) => (
          <div key={r.id} className="card flex justify-between">
            <span className="text-white">{r.client.name}</span>
            <span className="badge">{r.status}</span>
          </div>
        ))}
        {!requests.length && <p className="text-slate-500">No requests yet.</p>}
      </div>
    </>
  );
}
