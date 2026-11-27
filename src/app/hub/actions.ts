"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import {
  SUSPENDING_CASES,
  canAssignClients,
  canDev,
  canInvestigation,
  canManageQueue,
  canManageStaff,
  canSales,
  isCEO,
} from "@/lib/rbac";
import type { CaseType, Role, TaskStatus } from "@prisma/client";

const str = (max = 2000) => z.string().trim().min(1).max(max);
const opt = (max = 2000) =>
  z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), z.string().trim().max(max).optional());
const obj = (fd: FormData) => Object.fromEntries(fd.entries());

const STATUSES = ["CLIENT", "AFFILIATE", "IN_TALKS", "DECLINED", "UNABLE_TO_SERVE", "ENDED", "SUSPENDED"] as const;
const ROLES = ["CEO", "COO", "CCO", "DIRECTOR_SALES", "SALES", "INVESTIGATOR", "DIRECTOR_ENGINEERING", "DEVELOPER"] as const;
const CASE_TYPES = ["SOFT_SUSPENSION", "REGULAR_SUSPENSION", "PERMANENT_SUSPENSION", "APPEALED_SUSPENSION", "GROUP_BLACKLIST", "USER_BLACKLIST"] as const;

async function notify(userIds: string[], message: string, link?: string) {
  if (!userIds.length) return;
  await db.notification.createMany({ data: userIds.map((userId) => ({ userId, message, link })) });
}
const ceoIds = async () => (await db.staffUser.findMany({ where: { role: "CEO", active: true }, select: { id: true } })).map((u) => u.id);

async function uniqueSlug(name: string) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "client";
  let slug = base;
  for (let i = 2; await db.client.findUnique({ where: { slug } }); i++) slug = `${base}-${i}`;
  return slug;
}

/* ---------------- Sales ---------------- */

const clientSchema = z.object({
  name: str(100),
  robloxGroupId: opt(30),
  robloxUrl: opt(300),
  discordInvite: opt(300),
  logoUrl: opt(500),
  description: opt(1000),
  adText: opt(1500),
  status: z.enum(STATUSES),
});

export async function createClient(fd: FormData) {
  const user = await requireUser(canSales);
  const d = clientSchema.parse(obj(fd));
  // Only the Investigation Team may mark a client as suspended
  if (d.status === "SUSPENDED") throw new Error("Use the Investigation hub to suspend clients.");
  await db.client.create({ data: { ...d, slug: await uniqueSlug(d.name), assignedRepId: user.id } });
  revalidatePath("/hub/sales", "layout");
}

export async function updateClient(fd: FormData) {
  const user = await requireUser(canSales);
  const { id, ...rest } = z.object({ id: str(40) }).and(clientSchema.partial()).parse(obj(fd));
  const client = await db.client.findUniqueOrThrow({ where: { id } });
  if (client.status === "SUSPENDED") throw new Error("This client is suspended; status is managed by the Investigation Team.");
  if (rest.status === "SUSPENDED") throw new Error("Use the Investigation hub to suspend clients.");
  if (user.role === "SALES" && client.assignedRepId && client.assignedRepId !== user.id)
    throw new Error("This client is assigned to another representative.");
  await db.client.update({ where: { id }, data: { ...rest, ...(client.assignedRepId ? {} : { assignedRepId: user.id }) } });
  revalidatePath("/hub/sales", "layout");
  revalidatePath("/clients");
}

export async function postAnnouncement(fd: FormData) {
  const user = await requireUser(canSales);
  const d = z.object({ clientId: str(40), title: str(150), body: str(3000) }).parse(obj(fd));
  const client = await db.client.findUniqueOrThrow({ where: { id: d.clientId } });
  if (client.status !== "AFFILIATE" && client.status !== "CLIENT") throw new Error("Announcements are only for clients and affiliates.");
  await db.announcement.create({ data: { ...d, authorId: user.id } });
  revalidatePath(`/clients/${client.slug}`);
  revalidatePath("/hub/sales/affiliates");
}

export async function assignClient(fd: FormData) {
  await requireUser(canAssignClients);
  const d = z.object({ clientId: str(40), repId: opt(40) }).parse(obj(fd));
  await db.client.update({ where: { id: d.clientId }, data: { assignedRepId: d.repId || null } });
  if (d.repId) await notify([d.repId], "A client group was assigned to you.", "/hub/sales");
  revalidatePath("/hub/sales", "layout");
}

export async function requestLicense(fd: FormData) {
  const user = await requireUser(canSales);
  const d = z.object({ clientId: str(40), product: str(60), notes: opt(1000) }).parse(obj(fd));
  const client = await db.client.findUniqueOrThrow({ where: { id: d.clientId } });
  if (client.status === "SUSPENDED") throw new Error("Client is suspended.");
  await db.licenseRequest.create({
    data: { kind: "CREATE", clientId: d.clientId, product: d.product, notes: d.notes, requesterId: user.id },
  });
  await notify(await ceoIds(), `New license request for ${client.name} from ${user.name}.`, "/hub/ceo/licenses");
  revalidatePath("/hub/sales/licenses");
  revalidatePath("/hub/ceo/licenses");
}

/* ---------------- Investigation ---------------- */

export async function createCase(fd: FormData) {
  const user = await requireUser(canInvestigation);
  const d = z
    .object({
      type: z.enum(CASE_TYPES),
      targetType: z.enum(["USER", "GROUP"]),
      targetName: str(100),
      targetRobloxId: opt(30),
      reason: str(3000),
      evidence: opt(3000),
      clientId: opt(40),
    })
    .parse(obj(fd));
  await db.case.create({ data: { ...d, createdById: user.id } });
  if (d.clientId && SUSPENDING_CASES.includes(d.type)) await suspendClient(d.clientId);
  revalidatePath("/hub/investigation");
  revalidatePath("/clients");
}

async function suspendClient(clientId: string) {
  const c = await db.client.findUnique({ where: { id: clientId } });
  if (!c || c.status === "SUSPENDED") return;
  await db.client.update({ where: { id: clientId }, data: { status: "SUSPENDED", statusBeforeSuspension: c.status } });
}

async function restoreClientIfClear(clientId: string) {
  const active = await db.case.count({ where: { clientId, active: true, type: { in: SUSPENDING_CASES as CaseType[] } } });
  if (active > 0) return;
  const c = await db.client.findUnique({ where: { id: clientId } });
  if (c?.status === "SUSPENDED")
    await db.client.update({ where: { id: clientId }, data: { status: c.statusBeforeSuspension ?? "ENDED", statusBeforeSuspension: null } });
}

/** Lift a case, or mark a suspension as appealed (also lifts the hide). */
export async function liftCase(fd: FormData) {
  await requireUser(canInvestigation);
  const d = z.object({ id: str(40), mode: z.enum(["lift", "appeal", "reinstate"]) }).parse(obj(fd));
  const c = await db.case.findUniqueOrThrow({ where: { id: d.id } });
  if (d.mode === "reinstate") {
    await db.case.update({ where: { id: d.id }, data: { active: true } });
    if (c.clientId && SUSPENDING_CASES.includes(c.type)) await suspendClient(c.clientId);
  } else {
    await db.case.update({
      where: { id: d.id },
      data: { active: false, ...(d.mode === "appeal" ? { type: "APPEALED_SUSPENSION" as CaseType } : {}) },
    });
    if (c.clientId) await restoreClientIfClear(c.clientId);
  }
  revalidatePath("/hub/investigation");
  revalidatePath("/clients");
}

export async function requestSuspension(fd: FormData) {
  const user = await requireUser(canInvestigation);
  const d = z.object({ clientId: str(40), notes: str(1000) }).parse(obj(fd));
  const client = await db.client.findUniqueOrThrow({ where: { id: d.clientId } });
  await db.licenseRequest.create({ data: { kind: "SUSPEND", clientId: d.clientId, notes: d.notes, requesterId: user.id } });
  await notify(await ceoIds(), `License suspension requested for ${client.name} by ${user.name}.`, "/hub/ceo/licenses");
  revalidatePath("/hub/investigation/license-request");
  revalidatePath("/hub/ceo/licenses");
}

/* ---------------- CEO: license queue ---------------- */

export async function resolveRequest(fd: FormData) {
  const user = await requireUser(isCEO);
  const d = z
    .object({
      id: str(40),
      action: z.enum(["complete", "reject"]),
      licenseKey: opt(200),
      subjectType: z.enum(["GROUP", "USER", "GAME"]).optional(),
      subjectId: opt(40),
      expiresAt: opt(30),
    })
    .parse(obj(fd));
  const r = await db.licenseRequest.findUniqueOrThrow({ where: { id: d.id }, include: { client: true } });
  if (r.status !== "PENDING") throw new Error("Request already resolved.");
  let key: string | null = null;
  if (d.action === "complete" && r.kind === "CREATE") {
    const subjectId = d.subjectId || r.client.robloxGroupId;
    if (!d.subjectType || !subjectId) throw new Error("Subject type and ID are required.");
    key = d.licenseKey || `NSP-${randomBytes(12).toString("hex").toUpperCase().match(/.{1,6}/g)!.join("-")}`;
    await db.license.create({
      data: {
        key,
        product: r.product,
        subjectType: d.subjectType,
        subjectId,
        clientId: r.clientId,
        expiresAt: d.expiresAt ? new Date(d.expiresAt) : null,
      },
    });
  }
  if (d.action === "complete" && r.kind === "SUSPEND") {
    await db.license.updateMany({ where: { clientId: r.clientId }, data: { status: "SUSPENDED" } });
  }
  await db.licenseRequest.update({
    where: { id: d.id },
    data: {
      status: d.action === "complete" ? "COMPLETED" : "REJECTED",
      licenseKey: key,
      resolverId: user.id,
      resolvedAt: new Date(),
    },
  });
  const verb = d.action === "complete" ? (r.kind === "CREATE" ? "license key issued" : "license suspended") : "request rejected";
  await notify([r.requesterId], `${r.client.name}: ${verb}.`, r.kind === "CREATE" ? "/hub/sales/licenses" : "/hub/investigation/license-request");
  revalidatePath("/hub", "layout");
}

/* ---------------- Development tasks ---------------- */

export async function createTask(fd: FormData) {
  const user = await requireUser(isCEO);
  const d = z.object({ title: str(150), description: opt(3000), assigneeId: opt(40) }).parse(obj(fd));
  await db.task.create({
    data: { title: d.title, description: d.description, createdById: user.id, assigneeId: d.assigneeId || null, inQueue: !d.assigneeId },
  });
  if (d.assigneeId) await notify([d.assigneeId], `New task assigned: ${d.title}`, "/hub/dev");
  else {
    const dirs = await db.staffUser.findMany({ where: { role: "DIRECTOR_ENGINEERING", active: true }, select: { id: true } });
    await notify(dirs.map((x) => x.id), `New task in your queue: ${d.title}`, "/hub/dev/queue");
  }
  revalidatePath("/hub", "layout");
}

export async function assignTask(fd: FormData) {
  await requireUser(canManageQueue);
  const d = z.object({ id: str(40), assigneeId: str(40) }).parse(obj(fd));
  const t = await db.task.update({ where: { id: d.id }, data: { assigneeId: d.assigneeId, inQueue: false } });
  await notify([d.assigneeId], `New task assigned: ${t.title}`, "/hub/dev");
  revalidatePath("/hub", "layout");
}

export async function setTaskStatus(fd: FormData) {
  const user = await requireUser(canDev);
  const d = z.object({ id: str(40), status: z.enum(["TODO", "IN_PROGRESS", "DONE"]) }).parse(obj(fd));
  const t = await db.task.findUniqueOrThrow({ where: { id: d.id } });
  if (t.assigneeId !== user.id && !canManageQueue(user.role)) throw new Error("Not your task.");
  await db.task.update({ where: { id: d.id }, data: { status: d.status as TaskStatus } });
  revalidatePath("/hub", "layout");
}

/* ---------------- Staff management (Executive) ---------------- */

export async function addStaff(fd: FormData) {
  await requireUser(canManageStaff);
  const d = z
    .object({ displayName: str(60), role: z.enum(ROLES), discordId: opt(30), robloxId: opt(30), title: opt(60) })
    .parse(obj(fd));
  const back = (msg: string) => redirect(`/hub/executive/staff?error=${encodeURIComponent(msg)}`);
  if (!d.discordId && !d.robloxId) back("Provide a Discord ID or a Roblox ID.");
  const or: { discordId?: string; robloxId?: string }[] = [];
  if (d.discordId) or.push({ discordId: d.discordId });
  if (d.robloxId) or.push({ robloxId: d.robloxId });
  const existing = await db.staffUser.findFirst({ where: { OR: or } });
  if (existing) back(`That ID already belongs to ${existing.displayName}${existing.active ? "" : " (deactivated)"}. Edit that user below instead.`);
  await db.staffUser.create({ data: d });
  revalidatePath("/hub/executive/staff");
  revalidatePath("/staff");
  redirect("/hub/executive/staff?added=1");
}

export async function updateStaff(fd: FormData) {
  const me = await requireUser(canManageStaff);
  const d = z
    .object({
      id: str(40),
      role: z.enum(ROLES),
      title: opt(60),
      active: z.preprocess((v) => v === "on" || v === "true", z.boolean()),
      publicVisible: z.preprocess((v) => v === "on" || v === "true", z.boolean()),
    })
    .parse(obj(fd));
  const target = await db.staffUser.findUniqueOrThrow({ where: { id: d.id } });
  if (d.id === me.id && (!d.active || d.role !== me.role)) throw new Error("You cannot change your own role or deactivate yourself.");
  // Only the CEO may touch CEO accounts or grant the CEO role
  if (me.role !== "CEO" && (target.role === "CEO" || d.role === "CEO")) throw new Error("Only the CEO can manage CEO accounts.");
  await db.staffUser.update({ where: { id: d.id }, data: { role: d.role as Role, title: d.title ?? null, active: d.active, publicVisible: d.publicVisible } });
  revalidatePath("/hub/executive/staff");
  revalidatePath("/staff");
}

/* ---------------- Legal pages (Executive) ---------------- */

export async function saveLegalPage(fd: FormData) {
  await requireUser(canManageStaff);
  const d = z.object({ slug: z.enum(["privacy", "terms"]), title: str(100), content: str(50000) }).parse(obj(fd));
  await db.legalPage.upsert({ where: { slug: d.slug }, create: d, update: { title: d.title, content: d.content } });
  revalidatePath(`/${d.slug}`);
  revalidatePath("/hub/executive/legal");
}

export async function resetLegalPage(fd: FormData) {
  await requireUser(canManageStaff);
  const d = z.object({ slug: z.enum(["privacy", "terms"]) }).parse(obj(fd));
  await db.legalPage.deleteMany({ where: { slug: d.slug } });
  revalidatePath(`/${d.slug}`);
  revalidatePath("/hub/executive/legal");
}

/* ---------------- Notifications ---------------- */

export async function markNotificationsRead() {
  const user = await requireUser();
  await db.notification.updateMany({ where: { userId: user.id, read: false }, data: { read: true } });
  revalidatePath("/hub", "layout");
}
