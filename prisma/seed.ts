import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  const discordId = process.env.INITIAL_CEO_DISCORD_ID || undefined;
  const robloxId = process.env.INITIAL_CEO_ROBLOX_ID || undefined;
  if (!discordId && !robloxId) {
    console.log("Set INITIAL_CEO_DISCORD_ID or INITIAL_CEO_ROBLOX_ID to seed the first CEO.");
    return;
  }
  const or: { discordId?: string; robloxId?: string }[] = [];
  if (discordId) or.push({ discordId });
  if (robloxId) or.push({ robloxId });
  const existing = await db.staffUser.findFirst({ where: { OR: or } });
  if (existing) return console.log("CEO already exists:", existing.displayName);
  await db.staffUser.create({
    data: {
      discordId,
      robloxId,
      displayName: process.env.INITIAL_CEO_NAME || "CEO",
      role: "CEO",
      title: "Chief Executive Officer",
    },
  });
  console.log("Seeded first CEO.");
}
main().finally(() => db.$disconnect());
