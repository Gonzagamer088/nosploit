import { setTaskStatus } from "@/app/hub/actions";

type T = { id: string; title: string; description: string | null; status: string; assignee?: { displayName: string } | null };

export default function TaskCard({ t, showAssignee }: { t: T; showAssignee?: boolean }) {
  return (
    <div className="card">
      <div className="font-semibold text-white">{t.title}</div>
      {t.description && <p className="mt-1 whitespace-pre-wrap text-sm text-slate-400">{t.description}</p>}
      {showAssignee && <div className="mt-1 text-xs text-slate-500">Assignee: {t.assignee?.displayName ?? "Unassigned"}</div>}
      <form action={setTaskStatus} className="mt-3 flex gap-2">
        <input type="hidden" name="id" value={t.id} />
        <select name="status" defaultValue={t.status} className="input py-1">
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <button className="btn-ghost py-1">Update</button>
      </form>
    </div>
  );
}
