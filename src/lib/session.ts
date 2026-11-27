import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { authOptions } from "./auth";

/** Server-side guard: redirects to login when signed out, or back to the hub when the role lacks access. */
export async function requireUser(check?: (r: Role) => boolean) {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user?.id) redirect("/login");
  if (check && !check(user.role)) redirect("/hub?denied=1");
  return user;
}
