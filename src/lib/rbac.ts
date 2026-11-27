import type { Role } from "@prisma/client";

export const EXEC: Role[] = ["CEO", "COO", "CCO"];
export const isExec = (r: Role) => EXEC.includes(r);
export const isCEO = (r: Role) => r === "CEO";

export const canSales = (r: Role) => isExec(r) || r === "DIRECTOR_SALES" || r === "SALES";
export const canInvestigation = (r: Role) => isExec(r) || r === "INVESTIGATOR";
export const canDev = (r: Role) => isExec(r) || r === "DIRECTOR_ENGINEERING" || r === "DEVELOPER";
/** Assign or reassign client groups to sales reps */
export const canAssignClients = (r: Role) => isExec(r) || r === "DIRECTOR_SALES";
/** Task queue inbox and assigning tasks to developers */
export const canManageQueue = (r: Role) => isExec(r) || r === "DIRECTOR_ENGINEERING";
/** Master list of all tasks */
export const canSeeAllTasks = canManageQueue;
export const canManageStaff = (r: Role) => isExec(r);
/** Read-only blacklist lookups (sales) and full access (investigation) */
export const canCheckBlacklist = (r: Role) => canSales(r) || canInvestigation(r);

export const ROLE_LABEL: Record<Role, string> = {
  CEO: "Chief Executive Officer",
  COO: "Chief Operating Officer",
  CCO: "Chief Commercial Officer",
  DIRECTOR_SALES: "Director of Sales",
  SALES: "Sales Representative",
  INVESTIGATOR: "Investigation Team",
  DIRECTOR_ENGINEERING: "Director of Engineering",
  DEVELOPER: "Developer",
};

export const DEPARTMENTS: { key: string; roles: Role[] }[] = [
  { key: "Executive Team", roles: ["CEO", "COO", "CCO"] },
  { key: "Sales Team", roles: ["DIRECTOR_SALES", "SALES"] },
  { key: "Investigation Team", roles: ["INVESTIGATOR"] },
  { key: "Development Team", roles: ["DIRECTOR_ENGINEERING", "DEVELOPER"] },
];

export const STATUS_LABEL: Record<string, string> = {
  CLIENT: "Client",
  AFFILIATE: "Affiliate",
  IN_TALKS: "In talks",
  DECLINED: "Declined offer",
  UNABLE_TO_SERVE: "Unable to serve",
  ENDED: "Ended partnership",
  SUSPENDED: "Suspended",
};

export const CASE_LABEL: Record<string, string> = {
  SOFT_SUSPENSION: "Soft suspension",
  REGULAR_SUSPENSION: "Regular suspension",
  PERMANENT_SUSPENSION: "Permanent suspension",
  APPEALED_SUSPENSION: "Appealed suspension",
  GROUP_BLACKLIST: "Group blacklist",
  USER_BLACKLIST: "User blacklist",
};

/** Case types that suspend a linked client (hiding its public page) */
export const SUSPENDING_CASES = ["SOFT_SUSPENSION", "REGULAR_SUSPENSION", "PERMANENT_SUSPENSION"];

/** Public visibility rule for client pages. Suspended clients are always hidden. */
export const isPubliclyVisible = (status: string) => status === "CLIENT" || status === "AFFILIATE";
