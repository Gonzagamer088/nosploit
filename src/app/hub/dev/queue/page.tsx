import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { canManageQueue } from "@/lib/rbac";
import { PageTitle } from "@/components/ui";
import { assignTask } from "../../actions";

export default async function Queue() {
  await requireUser(canManageQueue);
  const [tasks, devs] = await Promise.all([
    db.task.findMany({ where: { inQueue: true }, include: { createdBy: { select: { displayName: true } } }, orderBy: { createdAt: "asc" } }),
    db.staffUser.findMany({ where: { active: true, role: { in: ["DEVELOPER", "DIRECTOR_ENGINEERING"] } }, orderBy: { displayName: "asc" } }),
  ]);
  return (
    <>
      <PageTitle title="Task Queue" sub="Incoming tasks from the CEO. Assign them to a developer." />
      <div className="space-y-3">
        {tasks.map((t) => (
          <div key={t.id} className="card">
            <div className="font-semibold text-white">{t.title}</div>
            {t.description && <p className="mt-1 whitespace-pre-wrap text-sm text-slate-400">{t.description}</p>}
            <div className="mt-1 text-xs text-slate-500">From {t.createdBy.displayName}</div>
            <form action={assignTask} className="mt-3 flex gap-2">
              <input type="hidden" name="id" value={t.id} />
              <select name="assigneeId" required className="input py-1">
                {devs.map((d) => <option key={d.id} value={d.id}>{d.displayName}</option>)}
              </select>
              <button className="btn-primary py-1">Assign</button>
            </form>
          </div>
        ))}
        {!tasks.length && <p className="text-slate-500">Queue is empty.</p>}
      </div>
    </>
  );
}
