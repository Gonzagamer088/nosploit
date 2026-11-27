"use client";

import { signIn, signOut } from "next-auth/react";

export function SignInButtons() {
  return (
    <div className="space-y-3">
      <button className="btn-primary w-full py-3" onClick={() => signIn("discord", { callbackUrl: "/hub" })}>
        Continue with Discord
      </button>
      <button className="btn-ghost w-full py-3" onClick={() => signIn("roblox", { callbackUrl: "/hub" })}>
        Continue with Roblox
      </button>
    </div>
  );
}

export function SignOutButton() {
  return (
    <button className="btn-ghost w-full py-1.5" onClick={() => signOut({ callbackUrl: "/" })}>
      Sign out
    </button>
  );
}
