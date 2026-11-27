import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { PageTitle } from "@/components/ui";
import { markNotificationsRead } from "../actions";

export default async function Notifications() {
  const user = await requireUser();
  const items = await db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <>
      <PageTitle title="Notifications" />
      <form action={markNotificationsRead} className="mb-4">
        <button className="btn-ghost">Mark all as read</button>
      </form>
      <div className="space-y-2">
        {items.map((n) => (
          <div key={n.id} className={`card flex justify-between ${n.read ? "opacity-60" : "border-brand/50"}`}>
            <div>
              <div className="text-sm text-slate-100">{n.message}</div>
              <div className="text-xs text-slate-500">{n.createdAt.toLocaleString("en-US")}</div>
            </div>
            {n.link && <Link href={n.link} className="text-sm text-brand-soft">Open</Link>}
          </div>
        ))}
        {!items.length && <p className="text-slate-500">No notifications.</p>}
      </div>
    </>
  );
}
