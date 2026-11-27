import { db } from "@/lib/db";
import { DEPARTMENTS, ROLE_LABEL } from "@/lib/rbac";
import { Avatar } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Staff" };

export default async function StaffPage() {
  const staff = await db.staffUser.findMany({
    where: { active: true, publicVisible: true },
    orderBy: { createdAt: "asc" },
    select: { id: true, displayName: true, avatarUrl: true, role: true, title: true },
  });
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-4xl font-extrabold text-white">Our Team</h1>
      {DEPARTMENTS.map((d) => {
        const members = staff
          .filter((s) => d.roles.includes(s.role))
          .sort((a, b) => d.roles.indexOf(a.role) - d.roles.indexOf(b.role));
        if (!members.length) return null;
        return (
          <section key={d.key} className="mt-12">
            <h2 className="mb-4 border-b border-line pb-2 text-sm font-bold uppercase tracking-widest text-brand-soft">{d.key}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((m) => (
                <div key={m.id} className="card flex flex-col items-center text-center">
                  <Avatar src={m.avatarUrl} name={m.displayName} size={72} />
                  <div className="mt-3 font-semibold text-white">{m.displayName}</div>
                  <div className="text-xs text-slate-400">{m.title || ROLE_LABEL[m.role]}</div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
      {!staff.length && <p className="mt-10 text-slate-400">Team roster coming soon.</p>}
    </div>
  );
}
