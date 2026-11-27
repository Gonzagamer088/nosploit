import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { db } from "./db";

const RobloxProvider = {
  id: "roblox",
  name: "Roblox",
  type: "oauth" as const,
  wellKnown: "https://apis.roblox.com/oauth/.well-known/openid-configuration",
  authorization: { params: { scope: "openid profile" } },
  idToken: false,
  checks: ["pkce", "state"] as ("pkce" | "state")[],
  client: { token_endpoint_auth_method: "client_secret_post" as const },
  clientId: process.env.ROBLOX_CLIENT_ID,
  clientSecret: process.env.ROBLOX_CLIENT_SECRET,
  userinfo: "https://apis.roblox.com/oauth/v1/userinfo",
  profile(p: { sub: string; preferred_username?: string; nickname?: string; picture?: string }) {
    return { id: p.sub, name: p.nickname || p.preferred_username || p.sub, image: p.picture ?? null };
  },
};

const whereFor = (provider: string, id: string) =>
  provider === "discord" ? { discordId: id } : { robloxId: id };

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 },
  pages: { signIn: "/login", error: "/login" },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      // Discord returns an `iss` param on the callback; openid-client requires an issuer to be set
      issuer: "https://discord.com",
    }),
    RobloxProvider,
  ],
  callbacks: {
    // Whitelist: only active staff records may sign in
    async signIn({ account, user }) {
      if (!account) return false;
      const staff = await db.staffUser.findFirst({
        where: { ...whereFor(account.provider, account.providerAccountId), active: true },
      });
      if (!staff) return "/login?error=NotWhitelisted";
      if (user.image) await db.staffUser.update({ where: { id: staff.id }, data: { avatarUrl: user.image } });
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        const staff = await db.staffUser.findFirst({ where: whereFor(account.provider, account.providerAccountId) });
        token.staffId = staff?.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Re-read the role on every request so role changes/deactivation apply immediately
      const staff = token.staffId ? await db.staffUser.findUnique({ where: { id: token.staffId } }) : null;
      if (!staff || !staff.active) return { expires: session.expires } as never;
      session.user = { id: staff.id, name: staff.displayName, image: staff.avatarUrl, role: staff.role };
      return session;
    },
  },
};
