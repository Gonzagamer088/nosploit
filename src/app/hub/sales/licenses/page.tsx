import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { canSales, isExec } from "@/lib/rbac";
import { Field, PageTitle } from "@/components/ui";
import { requestLicense } from "../../actions";

export default async function Licenses() {
  const user = await requireUser(canSales);
  const [clients, requests] = await Promise.all([
    db.client.findMany({ where: { status: { in: ["CLIENT", "AFFILIATE", "IN_TALKS"] } }, orderBy: { name: "asc" } }),
    db.licenseRequest.findMany({
      where: { kind: "CREATE", ...(isExec(user.role) ? {} : { requesterId: user.id }) },
      include: { client: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);
  return (
    <>
      <PageTitle title="License Requests" sub="Requests are sent to the CEO. You will be notified with the key." />
      <form action={requestLicense} className="card grid max-w-xl gap-3">
        <Field label="Client">
          <select name="clientId" required className="input">
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Product"><input name="product" defaultValue="default" required className="input" /></Field>
        <Field label="Notes"><textarea name="notes" rows={3} className="input" /></Field>
        <div><button className="btn-primary">Submit request</button></div>
      </form>

      <h2 className="mb-3 mt-10 text-lg font-bold text-white">Your requests</h2>
      <div className="space-y-2">
        {requests.map((r) => (
          <div key={r.id} className="card">
            <div className="flex justify-between">
              <span className="font-semibold text-white">{r.client.name}</span>
              <span className="badge">{r.status}</span>
            </div>
            {r.status === "COMPLETED" && r.licenseKey && (
              <code className="mt-2 block break-all rounded bg-bg p-2 text-sm text-emerald-300">{r.licenseKey}</code>
            )}
          </div>
        ))}
        {!requests.length && <p className="text-slate-500">No requests yet.</p>}
      </div>
    </>
  );
}
