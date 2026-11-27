import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { canDev } from "@/lib/rbac";
import { PageTitle } from "@/components/ui";
import TaskCard from "@/components/TaskCard";

const COLS: [string, string][] = [["TODO", "To Do"], ["IN_PROGRESS", "In Progress"], ["DONE", "Done"]];

export default async function MyTasks() {
  const user = await requireUser(canDev);
  const tasks = await db.task.findMany({ where: { assigneeId: user.id }, orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageTitle title="My Tasks" />
      <div className="grid gap-6 lg:grid-cols-3">
        {COLS.map(([k, label]) => (
          <div key={k}>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">{label}</h2>
            <div className="space-y-3">
              {tasks.filter((t) => t.status === k).map((t) => <TaskCard key={t.id} t={t} />)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
