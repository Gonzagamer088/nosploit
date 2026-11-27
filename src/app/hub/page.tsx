import { requireUser } from "@/lib/session";
import { ROLE_LABEL } from "@/lib/rbac";
import { PageTitle } from "@/components/ui";

export default async function HubHome({ searchParams }: { searchParams: { denied?: string } }) {
  const user = await requireUser();
  return (
    <>
      <PageTitle title={`Welcome, ${user.name}`} sub={ROLE_LABEL[user.role]} />
      {searchParams.denied && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          You do not have access to that page.
        </div>
      )}
      <p className="text-slate-400">Use the sidebar to open the tools available for your role.</p>
    </>
  );
}
