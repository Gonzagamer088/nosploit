import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { canAssignClients } from "@/lib/rbac";
import { PageTitle } from "@/components/ui";
import { assignClient } from "../../actions";

export default async function Assign() {
  await requireUser(canAssignClients);
  const [clients, reps] = await Promise.all([
    db.client.findMany({ include: { assignedRep: { select: { displayName: true } } }, orderBy: { name: "asc" } }),
    db.staffUser.findMany({ where: { active: true, role: { in: ["SALES", "DIRECTOR_SALES"] } }, orderBy: { displayName: "asc" } }),
  ]);
  return (
    <>
      <PageTitle title="Assign Groups" sub="Assign or reassign client groups to sales representatives." />
      <div className="card overflow-x-auto p-0">
        <table className="w-full">
          <thead><tr><th className="th">Group</th><th className="th">Current rep</th><th className="th">Reassign</th></tr></thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-t border-line">
                <td className="td text-white">{c.name}</td>
                <td className="td text-slate-400">{c.assignedRep?.displayName ?? "Unassigned"}</td>
                <td className="td">
                  <form action={assignClient} className="flex gap-2">
                    <input type="hidden" name="clientId" value={c.id} />
                    <select name="repId" defaultValue={c.assignedRepId ?? ""} className="input py-1">
                      <option value="">Unassigned</option>
                      {reps.map((r) => <option key={r.id} value={r.id}>{r.displayName}</option>)}
                    </select>
                    <button className="btn-ghost py-1">Save</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
