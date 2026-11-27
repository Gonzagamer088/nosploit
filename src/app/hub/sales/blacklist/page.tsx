import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { canCheckBlacklist, canInvestigation } from "@/lib/rbac";
import { PageTitle } from "@/components/ui";

export default async function BlacklistChecker({ searchParams }: { searchParams: { q?: string } }) {
  const user = await requireUser(canCheckBlacklist);
  const q = searchParams.q?.trim();
  // Read-only: only a yes/no is returned for non-investigation roles; no case details are ever selected
  const hits = q
    ? await db.case.findMany({
        where: {
          active: true,
          type: { in: ["USER_BLACKLIST", "GROUP_BLACKLIST"] },
          OR: [{ targetRobloxId: q }, { targetName: { equals: q, mode: "insensitive" } }],
        },
        select: { id: true, type: true, targetName: true },
        take: 10,
      })
    : [];
  return (
    <>
      <PageTitle title="Blacklist Checker" sub="Verify a Roblox user or group is not blacklisted before selling a license." />
      <form className="mb-6 flex max-w-xl gap-2">
        <input name="q" defaultValue={q} placeholder="Roblox user/group ID or exact name" className="input" required />
        <button className="btn-primary">Check</button>
      </form>
      {q && (hits.length ? (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300">
          <b>Blacklisted.</b> Do not sell a license to this {hits[0].type === "USER_BLACKLIST" ? "user" : "group"}.
          {canInvestigation(user.role) && <div className="mt-1 text-sm">Matches: {hits.map((h) => h.targetName).join(", ")}</div>}
        </div>
      ) : (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-300">Not blacklisted.</div>
      ))}
    </>
  );
}
