import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { canSeeAllTasks } from "@/lib/rbac";
import { PageTitle } from "@/components/ui";

export default async function AllTasks() {
  await requireUser(canSeeAllTasks);
  const tasks = await db.task.findMany({
    where: { status: { not: "DONE" } },
    include: { assignee: { select: { displayName: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <PageTitle title="All Active Tasks" sub="Open tasks across the whole development team." />
      <div className="card overflow-x-auto p-0">
        <table className="w-full">
          <thead><tr><th className="th">Task</th><th className="th">Assignee</th><th className="th">Status</th></tr></thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} className="border-t border-line">
                <td className="td text-white">{t.title}</td>
                <td className="td text-slate-400">{t.assignee?.displayName ?? (t.inQueue ? "In queue" : "Unassigned")}</td>
                <td className="td"><span className="badge">{t.status.replace("_", " ")}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
