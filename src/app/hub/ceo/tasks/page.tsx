import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { isCEO } from "@/lib/rbac";
import { Field, PageTitle } from "@/components/ui";
import { createTask } from "../../actions";

export default async function Delegate() {
  await requireUser(isCEO);
  const devs = await db.staffUser.findMany({ where: { active: true, role: { in: ["DEVELOPER", "DIRECTOR_ENGINEERING"] } }, orderBy: { displayName: "asc" } });
  return (
    <>
      <PageTitle title="Delegate Task" sub="Send to the Director of Engineering's queue, or assign directly to a developer." />
      <form action={createTask} className="card grid max-w-xl gap-3">
        <Field label="Title"><input name="title" required className="input" /></Field>
        <Field label="Description"><textarea name="description" rows={4} className="input" /></Field>
        <Field label="Send to">
          <select name="assigneeId" className="input">
            <option value="">Director of Engineering queue</option>
            {devs.map((d) => <option key={d.id} value={d.id}>{d.displayName}</option>)}
          </select>
        </Field>
        <div><button className="btn-primary">Create task</button></div>
      </form>
    </>
  );
}
