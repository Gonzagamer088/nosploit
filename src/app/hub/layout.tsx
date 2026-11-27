import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { ROLE_LABEL, canDev, canInvestigation, canManageQueue, canManageStaff, canSales, isCEO, canAssignClients } from "@/lib/rbac";
import { Logo } from "@/components/ui";
import Providers from "@/components/Providers";
import { SignOutButton } from "@/components/AuthButtons";

export const dynamic = "force-dynamic";

export default async function HubLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const unread = await db.notification.count({ where: { userId: user.id, read: false } });
  const r = user.role;
  const groups: { title: string; links: [string, string][] }[] = [];
  if (canSales(r))
    groups.push({
      title: "Sales",
      links: [
        ["/hub/sales", "My Groups"],
        ["/hub/sales/crm", "CRM / Clients"],
        ["/hub/sales/affiliates", "Affiliates"],
        ["/hub/sales/blacklist", "Blacklist Checker"],
        ["/hub/sales/licenses", "License Requests"],
        ...(canAssignClients(r) ? ([["/hub/sales/assign", "Assign Groups"]] as [string, string][]) : []),
      ],
    });
  if (canInvestigation(r))
    groups.push({
      title: "Investigation",
      links: [
        ["/hub/investigation", "Cases"],
        ["/hub/investigation/license-request", "Suspension Request"],
      ],
    });
  if (canDev(r))
    groups.push({
      title: "Development",
      links: [
        ["/hub/dev", "My Tasks"],
        ...(canManageQueue(r) ? ([["/hub/dev/queue", "Task Queue"], ["/hub/dev/all", "All Tasks"]] as [string, string][]) : []),
      ],
    });
  if (isCEO(r))
    groups.push({
      title: "CEO",
      links: [
        ["/hub/ceo/licenses", "License Approvals"],
        ["/hub/ceo/tasks", "Delegate Tasks"],
      ],
    });
  if (canManageStaff(r)) groups.push({ title: "Executive", links: [["/hub/executive/staff", "Staff Access"], ["/hub/executive/legal", "Legal Pages"]] });

  return (
    <Providers>
      <div className="flex min-h-screen">
        <aside className="flex w-60 shrink-0 flex-col border-r border-line bg-panel p-4">
          <Link href="/hub" className="flex items-center gap-2 text-lg font-extrabold text-white">
            <Logo size={30} />
            <span>NO<span className="text-brand-soft">SPLOIT</span> <span className="text-xs font-normal text-slate-500">Hub</span></span>
          </Link>
          <nav className="mt-6 flex-1 space-y-5 overflow-y-auto">
            {groups.map((g) => (
              <div key={g.title}>
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-500">{g.title}</div>
                {g.links.map(([href, label]) => (
                  <Link key={href} href={href} className="block rounded-md px-2 py-1.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white">
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          <Link href="/hub/notifications" className="mb-3 flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-slate-300 hover:bg-white/5">
            Notifications
            {unread > 0 && <span className="rounded-full bg-brand px-2 text-xs font-bold text-white">{unread}</span>}
          </Link>
          <div className="mb-2 text-xs text-slate-400">
            <div className="font-semibold text-slate-200">{user.name}</div>
            {ROLE_LABEL[r]}
          </div>
          <SignOutButton />
        </aside>
        <main className="flex-1 overflow-x-auto p-8">{children}</main>
      </div>
    </Providers>
  );
}
