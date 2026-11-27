import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { ROLE_LABEL, canManageStaff } from "@/lib/rbac";
import { Field, PageTitle } from "@/components/ui";
import { addStaff, updateStaff } from "../../actions";

const roles = Object.keys(ROLE_LABEL) as (keyof typeof ROLE_LABEL)[];

export default async function StaffAccess() {
  const me = await requireUser(canManageStaff);
  const staff = await db.staffUser.findMany({ orderBy: [{ active: "desc" }, { displayName: "asc" }] });
  return (
    <>
      <PageTitle title="Staff Access Management" sub="Whitelist users into the Staff Hub and manage their roles." />
      <form action={addStaff} className="card grid max-w-3xl gap-3 sm:grid-cols-2">
        <Field label="Display name"><input name="displayName" required className="input" /></Field>
        <Field label="Role">
          <select name="role" className="input">{roles.filter((r) => r !== "CEO" || me.role === "CEO").map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</select>
        </Field>
        <Field label="Discord user ID"><input name="discordId" className="input" /></Field>
        <Field label="Roblox user ID"><input name="robloxId" className="input" /></Field>
        <Field label="Public title (optional)"><input name="title" className="input" /></Field>
        <div className="flex items-end"><button className="btn-primary">Whitelist user</button></div>
      </form>

      <div className="mt-10 space-y-3">
        {staff.map((s) => (
          <form key={s.id} action={updateStaff} className="card flex flex-wrap items-end gap-3">
            <input type="hidden" name="id" value={s.id} />
            <div className="min-w-40">
              <div className="font-semibold text-white">{s.displayName}</div>
              <div className="text-xs text-slate-500">{s.discordId ? `Discord ${s.discordId}` : ""} {s.robloxId ? `Roblox ${s.robloxId}` : ""}</div>
            </div>
            <Field label="Role">
              <select name="role" defaultValue={s.role} className="input py-1">{roles.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</select>
            </Field>
            <Field label="Title"><input name="title" defaultValue={s.title ?? ""} className="input py-1" /></Field>
            <label className="flex items-center gap-1 text-sm"><input type="checkbox" name="active" defaultChecked={s.active} /> Active</label>
            <label className="flex items-center gap-1 text-sm"><input type="checkbox" name="publicVisible" defaultChecked={s.publicVisible} /> Public</label>
            <button className="btn-ghost py-1">Save</button>
          </form>
        ))}
      </div>
    </>
  );
}
