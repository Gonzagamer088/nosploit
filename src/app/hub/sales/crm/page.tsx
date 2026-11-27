import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { canSales, STATUS_LABEL } from "@/lib/rbac";
import { PageTitle, StatusBadge } from "@/components/ui";
import { updateClient } from "../../actions";

const EDITABLE = ["CLIENT", "AFFILIATE", "IN_TALKS", "DECLINED", "UNABLE_TO_SERVE", "ENDED"];

export default async function CRM({ searchParams }: { searchParams: { q?: string; status?: string } }) {
  const user = await requireUser(canSales);
  const q = searchParams.q?.trim();
  const clients = await db.client.findMany({
    where: {
      ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { robloxGroupId: { contains: q } }] } : {}),
      ...(searchParams.status ? { status: searchParams.status as never } : {}),
    },
    include: { assignedRep: { select: { displayName: true } } },
    orderBy: { name: "asc" },
    take: 200,
  });
  return (
    <>
      <PageTitle title="CRM / Clients" sub="All contacted groups and their outreach status." />
      <form className="mb-4 flex gap-2">
        <input name="q" defaultValue={q} placeholder="Search name or group ID" className="input max-w-xs" />
        <select name="status" defaultValue={searchParams.status ?? ""} className="input max-w-[200px]">
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button className="btn-ghost">Filter</button>
      </form>
      <div className="card overflow-x-auto p-0">
        <table className="w-full">
          <thead><tr><th className="th">Group</th><th className="th">Group ID</th><th className="th">Rep</th><th className="th">Status</th><th className="th">Update</th></tr></thead>
          <tbody>
            {clients.map((c) => {
              const locked = c.status === "SUSPENDED" || (user.role === "SALES" && !!c.assignedRepId && c.assignedRepId !== user.id);
              return (
                <tr key={c.id} className="border-t border-line">
                  <td className="td font-medium text-white">{c.name}</td>
                  <td className="td text-slate-400">{c.robloxGroupId ?? "—"}</td>
                  <td className="td text-slate-400">{c.assignedRep?.displayName ?? "Unassigned"}</td>
                  <td className="td"><StatusBadge status={c.status} /></td>
                  <td className="td">
                    {locked ? <span className="text-xs text-slate-500">Locked</span> : (
                      <form action={updateClient} className="flex gap-2">
                        <input type="hidden" name="id" value={c.id} />
                        <select name="status" defaultValue={c.status} className="input py-1">
                          {EDITABLE.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                        </select>
                        <button className="btn-ghost py-1">Save</button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
